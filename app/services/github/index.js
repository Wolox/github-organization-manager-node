const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');
const { github: githubConfig } = require('../../../config').common;

const org = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    id: githubConfig.appId,
    privateKey: githubConfig.appPrivateKey,
    installationId: githubConfig.woloxInstallationId
  }
});

module.exports = org;
