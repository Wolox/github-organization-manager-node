const { createRepository: create, addDefaultTeamsToRepository } = require('../services/github/repositories');
const { getTeams: getTeamsGithub, createTeam: createTeamGithub } = require('../services/github/teams');

const createRepository = ({ repositoryName, isPrivate }) =>
  create({ repositoryName, isPrivate }).then(repository =>
    addDefaultTeamsToRepository({ repositoryName }).then(() => repository)
  );

const getTeams = () => getTeamsGithub().then(resp => ({ teams: resp.data }));
const createTeam = name => createTeamGithub(name).then(resp => ({ teams: resp.data }));

module.exports = { createRepository, getTeams, createTeam };
