import express from "express";
import db from "../db/index.js";
import { analyzeIssues } from "../services/llm.service.js";
import { fetchOpenIssues } from "../services/github.service.js";
import { cacheIssues } from "../utils/cacheIssues.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { repo, prompt } = req.body;

  if (!repo || !prompt) {
    return res.status(400).json({ error: "repo and prompt required" });
  }

  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT title, body, id, html_url, created_at FROM issues WHERE repo = ?`,
        [repo],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    let issues = rows;

    if (issues.length === 0) {
      const fetchedIssues = await fetchOpenIssues(repo);

      if (fetchedIssues.length === 0) {
        return res.status(404).json({
          error: "No open issues found for this repository"
        });
      }

      await cacheIssues(repo, fetchedIssues);

      issues = fetchedIssues.map(i => ({
        id: i.id,
        title: i.title,
        body: i.body,
        html_url: i.html_url,
        created_at: i.created_at
      }));
    }

    const analysis = await analyzeIssues(prompt, issues);
    res.json({ analysis });

  } catch (err) {
    console.error("Analyze error:", err.message);
    res.status(500).json({ error: "Analyze failed" });
  }
});

export default router;
