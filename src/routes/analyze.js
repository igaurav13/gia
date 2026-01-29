import express from "express";
import db from "../db/index.js";
import { analyzeIssues } from "../services/llm.service.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { repo, prompt } = req.body;

  if (!repo || !prompt) {
    return res.status(400).json({ error: "repo and prompt required" });
  }

  db.all(
    `SELECT title, body FROM issues WHERE repo = ?`,
    [repo],
    async (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "DB error" });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          error: "Repo not scanned or no issues cached"
        });
      }

      try {
        const analysis = await analyzeIssues(prompt, rows);
        res.json({ analysis });
      } catch {
        res.status(500).json({ error: "LLM failed" });
      }
    }
  );
});

export default router;
