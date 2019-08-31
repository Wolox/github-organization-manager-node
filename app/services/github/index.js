const Octokit = require('@octokit/rest');
const { github: githubConfig } = require('../../../config').common;

const org = new Octokit({
  type: 'oauth',
  auth: githubConfig.woloxAdminToken
});

module.exports = org;
