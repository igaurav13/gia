import axios from "axios";

const BASEURL = "https://api.github.com";

export async function fetchOpenIssues(repo) {
  const issues = [];
  
  try {
      const res = await axios.get(
        `${BASEURL}/repos/${repo}/issues`,
        {
          headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
              Accept: "application/vnd.github+json"
          },
          params: {
            state: "open",
          }
        }
      );

      const onlyIssues = res.data.filter(
        issue => !issue.pull_request
      );

      issues.push(...onlyIssues);

      return issues;
  } catch (error) {
    console.error(
      "Failed to fetch GitHub repo issues:",
      error.response?.data || error.message
    );
    throw error;
  }
}
