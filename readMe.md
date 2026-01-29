# GitHub Issues Scanner & Analyzer

This project implements a backend service that scans GitHub repositories for open issues, caches them locally, and analyzes them using a Large Language Model (LLM).

The goal of this assignment is to demonstrate backend design, caching strategies, API integration, and LLM-based natural language analysis.

---

## Tech Stack

* **Node.js**
* **Express.js**
* **SQLite** (local persistent storage)
* **GitHub REST API**
* **OpenAI API (LLM)**

---

## How to Run the Server

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
GITHUB_TOKEN=your_github_token (optional)
OPENAI_API_KEY=your_openai_api_key
```

### 4. Start the server

```bash
"dev-server": npm run dev 
"main-server": npm run start
```

The server will run at:

```
http://localhost:3000
```

---

## API Endpoints

### POST `/scan`

Fetches all open issues from a GitHub repository and caches them locally.

**Request**

```json
{
  "repo": "owner/repository-name"
}
```

**Response**

```json
{
  "repo": "owner/repository-name",
  "issues_fetched": 42,
  "cached_successfully": true
}
```

---

### POST `/analyze`

Analyzes cached GitHub issues using an LLM. If the repository has not been scanned yet, the server automatically scans and caches it before analysis (lazy caching).

**Request**

```json
{
  "repo": "owner/repository-name",
  "prompt": "Find themes across recent issues and recommend what the maintainers should fix first"
}
```

**Response**

```json
{
  "analysis": {
    "Summary": "...",
    "Issues_themes": ["..."],
    "Recommended_fix_order": [
      {
        "priority": "P1",
        "issue": "...",
        "reason": "..."
      }
    ]
  }
}
```

---

## Why SQLite Was Chosen for Caching

SQLite was selected as the local storage mechanism for the following reasons:

* **Persistence**: Cached issues survive server restarts
* **Structured storage**: Easy querying by repository and issue fields
* **No external dependencies**: No separate database server required
* **Production-like behavior**: More realistic than in-memory storage or JSON files
* **Scalability**: Handles growth better than file-based storage while remaining simple.

Compared to in-memory caching (non-persistent) 
and JSON file storage (harder to query and manage and risk of redundancy), where SQLite provides the best balance of durability, simplicity, and correctness for this project.

---


### Prompt Used for the Final LLM Analysis

#### These prompts few prompts that were used during debugging and architectural decisions:

- "How do I safely store GitHub API results using prepared SQLite statements?"

- "How should I combine GitHub issues and a natural-language prompt for an LLM?"

- "How can I structure LLM output so it is readable and consistent in JSON responses?"


#### The following prompt structure is used inside the `/analyze` endpoint:

```
You are a senior software maintainer.

Analyze the following GitHub issues.

Respond ONLY in valid JSON.
Do NOT include markdown or extra text.

JSON schema:
{
  "Summary": "string",
  "Issues_themes": ["string"],
  "Recommended_fix_order": [
    {
      "priority": "P1 | P2 | P3",
      "issue": "string",
      "reason": "string"
    }
  ]
}

User request:
<user prompt>

GitHub Issues:
<numbered list of issue titles and bodies>
```

This prompt ensures the LLM produces structured, readable, and deterministic output suitable for API responses.

---

## Design Notes

* Uses **lazy caching**: `/analyze` automatically scans and caches a repo if not already present
* Uses **prepared SQL statements** to prevent SQL injection
* Separates concerns between routes, services, and utilities
* Handles edge cases: missing repo, missing prompt, empty issue lists, and LLM failures

---

## Conclusion

This project demonstrates a clean backend design that integrates third-party APIs, local persistence, and LLM-based analysis while maintaining readability, robustness, and production-oriented patterns.
