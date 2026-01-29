import axios from "axios";

export async function fetchOpenIssues(repo) {
  const issues = [];
  let page = 1;

  while (true) {
    const res = await axios.get(
      `https://api.github.com/repos/${repo}/issues`,
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

    if (res.data.length < 100) break;
    page++;
  }

  return issues;
}
