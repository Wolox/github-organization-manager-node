const org = require('./index');
const { github: githubConfig } = require('../../../config').common;
const { MASTER_BRANCH } = require('./branches');
const { createCommit } = require('./commits');

const getRepositories = ({ pageNumber, typeOfRepos, perPage }) =>
  org.repos.listForOrg({
    org: githubConfig.woloxOrganizationName,
    per_page: perPage,
    page: pageNumber,
    sort: 'created',
    type: typeOfRepos
  });

const searchRepositories = ({ query = '', pageNumber, perPage, isPrivate = false, isPublic = false }) =>
  org.search.repos({
    q: `${isPrivate ? 'is:private' : ''} ${isPublic ? 'is:public' : ''} ${query} in:name org:${
      githubConfig.woloxOrganizationName
    }`,
    per_page: perPage,
    page: pageNumber
  });

const requestCreateRepository = ({ repositoryName, isPrivate }) =>
  org.repos.createInOrg({
    auto_init: true,
    org: githubConfig.woloxOrganizationName,
    name: repositoryName,
    private: isPrivate
  });

const countPrivateRepositories = async () => {
  const privateRepositories = await searchRepositories({ pageNumber: 1, isPrivate: true, perPage: 100 });
  return privateRepositories.data.total_count;
};

const createRepository = ({ repositoryName, isPrivate }) => {
  if (isPrivate) {
    return countPrivateRepositories().then(repositoryCount => {
      if (repositoryCount < githubConfig.privateRepositoriesQuota) {
        return requestCreateRepository({ repositoryName, isPrivate }).then(repository => ({
          repository,
          quotaLeft: githubConfig.privateRepositoriesQuota - repositoryCount
        }));
      }
      return Promise.reject(
        `No more private repos can be created: quota limit, current private repos: ${repositoryCount}`
      );
    });
  }
  return requestCreateRepository({ repositoryName, isPrivate }).then(repository => ({
    repository
  }));
};

const addTeamToRepository = ({ teamId, repositoryName }) =>
  org.teams
    .addOrUpdateRepo({
      team_id: teamId,
      owner: githubConfig.woloxOrganizationName,
      repo: repositoryName,
      permission: 'admin'
    })
    .then(resp => resp.data);

const addDefaultTeamsToRepository = ({ repositoryName }) =>
  Promise.all([
    addTeamToRepository({ teamId: githubConfig.tlsTeamId, repositoryName }),
    addTeamToRepository({ teamId: githubConfig.botsTeamId, repositoryName }),
    addTeamToRepository({ teamId: githubConfig.qualityTeamId, repositoryName })
  ]);

const addCodeownersToRepo = ({ repositoryName, codeowners }) => {
  const codeownersFileContent = `*       ${codeowners.map(co => `@${co}`).join(' ')}`;
  const changes = {
    files: {
      CODEOWNERS: codeownersFileContent
    },
    commit: 'Added CODEOWNERS file'
  };
  return createCommit({
    repositoryName,
    base: MASTER_BRANCH.branchName,
    changes
  }).then(resp => resp.data);
};

module.exports = {
  createRepository,
  getRepositories,
  searchRepositories,
  addDefaultTeamsToRepository,
  addTeamToRepository,
  addCodeownersToRepo
};
