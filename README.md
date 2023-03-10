# GitHub Action: Comment on Pull Requests included in Release

This GitHub Action adds a comment to all pull requests that were included in a GitHub release. The comment includes a link to the release, along with a celebratory emoji.

## Usage

To use this action, you will need to provide your GitHub access token and the name of your repository.

```yaml
name: Comment on Pull Requests included in Release
on:
  release:
    types: [published]

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - name: Comment on Pull Requests
        uses: nflaig/release-comment-on-pr@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          # customize message
          message: ":tada: This PR is included in [${releaseTag}](${releaseUrl}) :tada:" 
```

Note that this action is triggered by the release.published event, which occurs when a new release is published in your repository.

**IMPORTANT**: `GITHUB_TOKEN` does not have the required permissions to operate on protected branches. If you are using this action for protected branches,
replace `GITHUB_TOKEN` with a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

## Inputs

This action has two required inputs:

- `token`: Your GitHub access token. You can use `${{ secrets.GITHUB_TOKEN }}` to access the default token.
- `message`: The message to be included in the comment. This is passed to the action as a lodash template string.
  Available variables include: `releaseName`, `releaseTag`, `releaseUrl`, `pullRequestTitle`, `pullRequestUrl` and `pullRequestNumber`

## Outputs

This action does not have any outputs.

## Example

Here's an example of what the comment looks like:

:tada: This PR is included in [v1.0.0](https://github.com/owner/repo/releases/tag/v1.0.0) :tada:

## License

This GitHub Action is licensed under the [MIT License](LICENSE).
