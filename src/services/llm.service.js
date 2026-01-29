import axios from "axios";

export async function analyzeIssues(prompt, issues) {
  const content = `
User request:
${prompt}

GitHub issues:
${issues.map(i => `- ${i.title}: ${i.body}`).join("\n")}
`;

  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a senior software maintainer." },
        { role: "user", content }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    }
  );

  return res.data.choices[0].message.content;
}
