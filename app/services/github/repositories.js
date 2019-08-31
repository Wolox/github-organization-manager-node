const org = require('./index');
const { github: githubConfig } = require('../../../config').common;

const getRepositories = ({ pageNumber, typeOfRepos }) =>
  org.repos.list({
    org: githubConfig.woloxOrganizationName,
    per_page: '100',
    page: pageNumber,
    type: typeOfRepos
  });

const createRepository = ({ repositoryName, isPrivate }) =>
  org.repos.createInOrg({
    auto_init: true,
    org: githubConfig.woloxOrganizationName,
    name: repositoryName,
    private: isPrivate
  });

const addTeamToRepository = ({ teamId, repositoryName }) =>
  org.teams.addOrUpdateRepo({
    team_id: teamId,
    owner: githubConfig.woloxOrganizationName,
    repo: repositoryName,
    permission: 'admin'
  });

const addDefaultTeamsToRepository = ({ repositoryName }) =>
  Promise.all([
    addTeamToRepository({ teamId: githubConfig.tlsTeamId, repositoryName }),
    addTeamToRepository({ teamId: githubConfig.botsTeamId, repositoryName }),
    addTeamToRepository({ teamId: githubConfig.qualityTeamId, repositoryName })
  ]);

const addMemberToTeam = ({ teamId, username }) =>
  org.teams.addMember({
    team_id: teamId,
    username
  });

module.exports = {
  createRepository,
  getRepositories,
  addDefaultTeamsToRepository,
  addTeamToRepository,
  addMemberToTeam
};
