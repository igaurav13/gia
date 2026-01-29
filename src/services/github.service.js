import axios from "axios";

const github = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json"
  }
});

export async function fetchOpenIssues(repo) {
  const issues = [];
  let page = 1;

  console.log("GITHUB TOKEN----:::",process.env.GITHUB_TOKEN);
  
  try {
    while (true) {
      const res = await github.get(
        `/repos/${repo}/issues`,
        {
          params: {
            state: "open",
            per_page: 100,
            page
          }
        }
      );

      const onlyIssues = res.data.filter(
        issue => !issue.pull_request
      );

      issues.push(...onlyIssues);

      // stop when no more pages
      if (res.data.length < 100) break;

      page++;
    }

    return issues;
  } catch (error) {
    console.error(
      "Failed to fetch GitHub repo issues:",
      error.response?.data || error.message
    );
    throw error;
  }
}
