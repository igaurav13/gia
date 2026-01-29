import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(
  path.join(__dirname, "issues.db")
);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY,
      repo TEXT,
      title TEXT,
      body TEXT,
      html_url TEXT,
      created_at TEXT
    )
  `);
});

export default db;
