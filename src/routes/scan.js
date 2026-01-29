import express from "express";
import { fetchOpenIssues } from "../services/github.service.js";
import { cacheIssues } from "../utils/cacheIssues.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { repo } = req.body;

  if (!repo) {
    return res.status(400).json({ error: "repo is required" });
  }

  try {
    const issues = await fetchOpenIssues(repo);

    await cacheIssues(repo, issues);

    res.json({
      repo,
      issues_fetched: issues.length,
      cached_successfully: true
    });

  } catch (err) {
    console.error("Scan error:", err.message);
    res.status(500).json({ error: "Failed to scan repo" });
  }
});

export default router;
