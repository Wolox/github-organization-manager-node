const {
  createRepository: create,
  addDefaultTeamsToRepository,
  getTeams: getTeamsGithub,
  createTeam: createTeamGithub
} = require('../services/github');

const createRepository = ({ repositoryName, isPrivate }) =>
  create({ repositoryName, isPrivate }).then(() => addDefaultTeamsToRepository({ repositoryName }));

const getTeams = () => getTeamsGithub().then(resp => ({ teams: resp.data }));
const createTeam = name => createTeamGithub(name).then(resp => ({ teams: resp.data }));

module.exports = { createRepository, getTeams, createTeam };
