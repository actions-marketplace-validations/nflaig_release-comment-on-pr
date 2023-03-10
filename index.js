const core = require("@actions/core");
const github = require("@actions/github");
const issueParser = require("issue-parser");
const parse = issueParser("github");
const { template } = require("lodash");

async function run() {
  try {
    const token = core.getInput("token");
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    // Get the message template from the user input
    const messageTemplate =
      core.getInput("message", { required: false }) ||
      ":tada: This PR is included in [${releaseTag}](${releaseUrl}) :tada:";

    const { data: release } = await octokit.rest.repos.getRelease({ owner, repo, release_id: "latest" });

    // Parse the release notes to extract the pull request numbers
    const issues = parse(release.body).refs.map((ref) => ref.issue);

    // Post a comment on each pull request
    for (const issue of issues) {
      const prNumber = parseInt(issue);
      const { data: pullRequest } = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
      });
      const message = template(messageTemplate)({
        releaseName: release.name,
        releaseTag: release.tag_name,
        releaseUrl: release.html_url,
        pullRequestTitle: pullRequest.title,
        pullRequestUrl: pullRequest.html_url,
        pullRequestNumber: prNumber,
      });
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: message,
      });
    }

    console.log("Commented on pull requests included in release.");
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
