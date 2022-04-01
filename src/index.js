const { default: axios } = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');
const semver = require('semver');

const check = ({ prTitle, currentVersion, nextVersion }) => {
  if (!semver.valid(currentVersion)) {
    throw new Error(`Invalid current version: ${currentVersion}`);
  }

  if (!semver.valid(nextVersion)) {
    throw new Error(`Invalid next version: ${nextVersion}`);
  }

  if (semver.lte(nextVersion, currentVersion)) {
    throw new Error('The version is not updated');
  }

  const diffName = semver.diff(nextVersion, currentVersion);
  if (diffName === 'major' && !prTitle.includes('[release-major]')) {
    throw new Error('If the PR title does not contain [release-major], the major version number cannot be updated');
  }

  if (diffName === 'minor' && !prTitle.includes('[release-minor]')) {
    throw new Error('If the PR title does not contain [release-minor], the major version number cannot be updated');
  }

  const diff = Number(semver[diffName](nextVersion)) - Number(semver[diffName](currentVersion));

  if (diff > 1) {
    throw new Error('Warning: the version number you updated is greater than 1');
  }
};

async function run() {
  try {
    const contextPullRequest = github.context.payload.pull_request;
    if (!contextPullRequest) {
      throw new Error(
        "This action can only be invoked in `pull_request_target` or `pull_request` events. Otherwise the pull request can't be inferred."
      );
    }

    const baseSHA = contextPullRequest.base.sha;
    const headSHA = contextPullRequest.head.sha;
    const headers = {};
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      core.info('use authorization token');
      headers.Authorization = `token ${token}`;
    }

    const currentVersionURL = `https://raw.githubusercontent.com/${github.context.repo.owner}/${github.context.repo.repo}/${baseSHA}/version`;
    core.info(`current version url: ${currentVersionURL}`);
    let { data: currentVersion } = await axios.get(currentVersionURL, {
      headers,
    });
    currentVersion = currentVersion.toString().trim();

    const nextVersionURL = `https://raw.githubusercontent.com/${github.context.repo.owner}/${github.context.repo.repo}/${headSHA}/version`;
    core.info(`next version url: ${nextVersionURL}`);
    let { data: nextVersion } = await axios.get(nextVersionURL, {
      headers,
    });
    nextVersion = nextVersion.toString().trim();

    core.info(`current version:, ${currentVersion}`);
    core.info(`next version: ${nextVersion}`);

    check({ prTitle: contextPullRequest.title, currentVersion, nextVersion });

    core.info('Version check passed!');
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
module.exports.check = check;
