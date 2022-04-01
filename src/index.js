const core = require('@actions/core');
const github = require('@actions/github');
const { default: axios } = require('axios');
const { promises: fs } = require('fs');

module.exports = async function run() {
  try {
    const contextPullRequest = github.context.payload.pull_request;
    if (!contextPullRequest) {
      throw new Error(
        "This action can only be invoked in `pull_request_target` or `pull_request` events. Otherwise the pull request can't be inferred."
      );
    }

    const owner = contextPullRequest.base.user.login;
    const repo = contextPullRequest.base.repo.name;

    const baseSHA = github.context.payload.pull_request.base.sha;
    const headers = {};
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers.Authorization = token;
    }

    const versionURL = `https://raw.githubusercontent.com/${github.context.repo.owner}/${github.context.repo.repo}/${baseSHA}/version`;
    const { data } = await axios.get(versionURL, { headers });
    const baseVersion = data.toString().trim();
    console.log('base version:', baseVersion);
    const currentVersion = await fs.readFile('./version');
    console.log('current version:', currentVersion);
  } catch (error) {
    core.setFailed(error.message);
  }
};
