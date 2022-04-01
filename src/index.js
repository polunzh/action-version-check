const { promises: fs } = require('fs');
const { default: axios } = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');
const semver = require('semver');

module.exports = async function run() {
  try {
    const contextPullRequest = github.context.payload.pull_request;
    if (!contextPullRequest) {
      throw new Error(
        "This action can only be invoked in `pull_request_target` or `pull_request` events. Otherwise the pull request can't be inferred."
      );
    }

    const baseSHA = github.context.payload.pull_request.base.sha;
    const headers = {};
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers.Authorization = token;
    }

    const versionURL = `https://raw.githubusercontent.com/${github.context.repo.owner}/${github.context.repo.repo}/${baseSHA}/version`;
    const { data } = await axios.get(versionURL, { headers });
    const baseVersion = data.toString().trim();
    let currentVersion = await fs.readFile('./version');
    currentVersion = currentVersion.toString().trim();
    core.info(`Base version:', ${baseVersion}`);
    core.info(`Current version: ${currentVersion}`);

    if (!semver.valid(baseVersion)) {
      throw new Error(`Invalid base version: ${baseVersion}`);
    }

    if (!semver.valid(currentVersion)) {
      throw new Error(`Invalid current version: ${currentVersion}`);
    }

    if (semver.let(currentVersion, baseVersion)) {
      throw new Error('The version is not bumped');
    }

    core.info('Version check passed!');
  } catch (error) {
    core.setFailed(error.message);
  }
};
