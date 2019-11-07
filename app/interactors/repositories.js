const {
  createRepository: createRepositoryGithub,
  addDefaultTeamsToRepository,
  addTeamToRepository,
  addCodeownersToRepo: addCodeownersToRepoGithub,
  getRepositories: getRepositoriesGithub
} = require('../services/github/repositories');

const {
  createBranchFromMaster,
  updateBranchProtection,
  MASTER_BRANCH,
  DEVELOPMENT_BRANCH,
  STAGE_BRANCH
} = require('../services/github/branches');

const execDefaultRepositoryActions = ({ repositoryName }) =>
  Promise.all([
    addDefaultTeamsToRepository({ repositoryName }),
    createBranchFromMaster({ repositoryName, ...DEVELOPMENT_BRANCH }),
    createBranchFromMaster({ repositoryName, ...STAGE_BRANCH }),
    updateBranchProtection({ repositoryName, ...MASTER_BRANCH })
  ]);

const getRepositories = (pageNumber, typeOfRepos, perPage) =>
  getRepositoriesGithub(pageNumber, typeOfRepos, perPage).then(resp => ({
    repositories: resp.data.map(({ name, id, html_url, full_name }) => ({ name, id, html_url, full_name }))
  }));

const createRepository = (repositoryName, isPrivate) =>
  createRepositoryGithub({ repositoryName, isPrivate }).then(repository =>
    execDefaultRepositoryActions({ repositoryName }).then(() => repository)
  );

const addTeamToRepo = (teamId, repositoryName) =>
  addTeamToRepository({ teamId, repositoryName }).then(resp => resp.data);

const addCodeownersToRepo = (repositoryName, codeowners) =>
  addCodeownersToRepoGithub({ repositoryName, codeowners }).then(resp => resp.data);

module.exports = {
  createRepository,
  getRepositories,
  addTeamToRepo,
  addCodeownersToRepo
};
