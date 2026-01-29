import axios from "axios";

export async function analyzeIssues(prompt, issues) {
  const MAX_ISSUES = 30;
  const trimmedIssues = issues.slice(0, MAX_ISSUES);

const content = `
You are a senior software maintainer.

Analyze the following GitHub issues and respond ONLY in valid JSON.

Return this exact schema:
{
  "Summary": "string",
  "Issues-themes": ["string"],
  "Recommended_fix_order": [
    {
      "priority": "P1 | P2 | P3",
      "issue": "string",
      "reason": "string"
    }
  ]
}

User request:
${prompt}

GitHub Issues:
${trimmedIssues
  .map(
    (i, idx) =>
      `${idx + 1}. ${i.title}\n${i.body || "No description"}`)
  .join("\n\n")}`;


  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-5-nano",
      messages: [{ role: "user", content }]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    }
  );

  return JSON.parse(res.data.choices[0].message.content);
}
