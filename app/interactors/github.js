const {
  createRepository: create,
  addDefaultTeamsToRepository,
  addTeamToRepository,
  getRepositories: getRepositoriesGithub,
  addMemberToTeam: addMemberToTeamGithub
} = require('../services/github/repositories');
const { getTeams: getTeamsGithub, createTeam: createTeamGithub } = require('../services/github/teams');
const { createBranchFromMaster } = require('../services/github/branches');
const { developmentBranchName, stageBranchName } = require('../../config').common.github;

const execDefaultRepositoryActions = ({ repositoryName }) =>
  Promise.all([
    addDefaultTeamsToRepository({ repositoryName }),
    createBranchFromMaster({ repositoryName, branchName: developmentBranchName }),
    createBranchFromMaster({ repositoryName, branchName: stageBranchName })
  ]);

const createRepository = ({ repositoryName, isPrivate }) =>
  create({ repositoryName, isPrivate }).then(repository =>
    execDefaultRepositoryActions({ repositoryName }).then(() => repository)
  );

const getRepositories = () => getRepositoriesGithub().then(resp => ({ repositories: resp.data }));

const getTeams = () => getTeamsGithub().then(resp => ({ teams: resp.data }));

const createTeam = name => createTeamGithub(name).then(resp => resp.data);

const addTeamToRepo = (teamId, repositoryName) =>
  addTeamToRepository({ teamId, repositoryName }).then(resp => resp.data);

const addMemberToTeam = (teamId, username) =>
  addMemberToTeamGithub({ teamId, username }).then(resp => resp.data);

module.exports = { createRepository, getRepositories, getTeams, createTeam, addTeamToRepo, addMemberToTeam };
