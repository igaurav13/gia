import db from "../db/index.js";

export async function cacheIssues(repo, issues) {
  if (!issues || issues.length === 0) return;

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO issues
    (id, repo, title, body, html_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const issue of issues) {
    stmt.run(
      issue.id,
      repo,
      issue.title,
      issue.body,
      issue.html_url,
      issue.created_at
    );
  }

  stmt.finalize();
}
