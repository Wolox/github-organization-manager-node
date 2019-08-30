const Octokit = require('@octokit/rest');
const { github: githubConfig } = require('../../config').common;

const org = new Octokit({
  type: 'oauth',
  auth: githubConfig.woloxAdminToken
});

const createRepository = ({ repositoryName, isPrivate }) =>
  org.repos.createInOrg({
    auto_init: true,
    org: githubConfig.woloxOrganizationName,
    name: repositoryName,
    private: isPrivate
  });

const addDefaultTeamsToRepository = ({ repositoryName }) =>
  org.teams.addOrUpdateRepo({
    team_id: githubConfig.tlsTeamId,
    owner: githubConfig.woloxOrganizationName,
    repo: repositoryName,
    permission: 'admin'
  });

module.exports = { createRepository, addDefaultTeamsToRepository };
