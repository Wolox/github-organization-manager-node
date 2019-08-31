const org = require('./index');
const { github: githubConfig } = require('../../../config').common;

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

const getTeams = () =>
  org.teams.list({
    org: githubConfig.woloxOrganizationName
  });

const createTeam = name =>
  org.teams.create({
    org: githubConfig.woloxOrganizationName,
    name
  });

module.exports = { createRepository, addDefaultTeamsToRepository, getTeams, createTeam };
