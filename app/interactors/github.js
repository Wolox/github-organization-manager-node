const { createRepository: create, addDefaultTeamsToRepository } = require('../services/github/repositories');
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

const getTeams = () => getTeamsGithub().then(resp => ({ teams: resp.data }));
const createTeam = name => createTeamGithub(name).then(resp => ({ teams: resp.data }));

module.exports = { createRepository, getTeams, createTeam };
