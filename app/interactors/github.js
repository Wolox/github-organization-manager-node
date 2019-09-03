const {
  createRepository: create,
  addDefaultTeamsToRepository,
  addTeamToRepository,
  addMemberToTeam: addMemberToTeamGithub,
  addCodeownersToRepo: addCodeownersToRepoGithub,
  deleteTeam: deleteTeamGithub,
  getRepositories: getRepositoriesGithub
} = require('../services/github/repositories');
const { getTeams: getTeamsGithub, createTeam: createTeamGithub } = require('../services/github/teams');
const {
  createBranchFromMaster,
  updateBranchProtection,
  MASTER_BRANCH,
  DEVELOPMENT_BRANCH,
  STAGE_BRANCH
} = require('../services/github/branches');
const { addUser } = require('../services/github/organization');

const execDefaultRepositoryActions = ({ repositoryName }) =>
  Promise.all([
    addDefaultTeamsToRepository({ repositoryName }),
    createBranchFromMaster({ repositoryName, ...DEVELOPMENT_BRANCH }),
    createBranchFromMaster({ repositoryName, ...STAGE_BRANCH }),
    updateBranchProtection({ repositoryName, ...MASTER_BRANCH })
  ]);

const createRepository = ({ repositoryName, isPrivate }) =>
  create({ repositoryName, isPrivate }).then(repository =>
    execDefaultRepositoryActions({ repositoryName }).then(() => repository)
  );

const getRepositories = (pageNumber, typeOfRepos, perPage) =>
  getRepositoriesGithub(pageNumber, typeOfRepos, perPage).then(resp => resp);

const getTeams = (perPage, pageNumber) =>
  getTeamsGithub(perPage, pageNumber).then(resp => ({ teams: resp.data }));

const createTeam = name => createTeamGithub(name).then(resp => resp.data);

const addTeamToRepo = (teamId, repositoryName) =>
  addTeamToRepository({ teamId, repositoryName }).then(resp => resp.data);

const addMemberToTeam = (teamId, username) =>
  addMemberToTeamGithub({ teamId, username }).then(resp => resp.data);

const addCodeownersToRepo = (repositoryName, codeowners) =>
  addCodeownersToRepoGithub({ repositoryName, codeowners }).then(resp => resp.data);

const deleteTeam = teamId => deleteTeamGithub({ teamId }).then(resp => resp.data);

module.exports = {
  createRepository,
  getRepositories,
  getTeams,
  createTeam,
  addTeamToRepo,
  addMemberToTeam,
  addCodeownersToRepo,
  deleteTeam,
  addUser
};
