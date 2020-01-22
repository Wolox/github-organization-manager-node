const org = require('./index');
const { github: githubConfig } = require('../../../config').common;
const { MASTER_BRANCH } = require('./branches');
const { createCommit } = require('./commits');

const getRepositories = ({ pageNumber, typeOfRepos, perPage }) =>
  org.repos.list({
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
  const fetch1 = await searchRepositories({ pageNumber: 1, isPrivate: true, perPage: 100 });
  const fetch2 = await searchRepositories({ pageNumber: 2, isPrivate: true, perPage: 100 });

  const mappedFetch1 = fetch1.data.map(repo => repo.name);
  const mappedFetch2 = fetch2.data.map(repo => repo.name);

  return mappedFetch1.concat(mappedFetch2).length;
};

const createRepository = ({ repositoryName, isPrivate }) => {
  if (isPrivate) {
    return countPrivateRepositories().then(count =>
      count < 125
        ? requestCreateRepository({ repositoryName, isPrivate })
        : Promise.reject(`No more private repos can be created: quota limit, current private repos: ${count}`)
    );
  }
  return requestCreateRepository({ repositoryName, isPrivate });
};

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

const addMaintainerToTeam = ({ teamId, username }) =>
  org.teams.addOrUpdateMembership({
    team_id: teamId,
    role: 'maintainer',
    username
  });

const deleteTeam = ({ teamId }) =>
  org.teams.delete({
    team_id: teamId
  });

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
  });
};

module.exports = {
  createRepository,
  getRepositories,
  searchRepositories,
  addDefaultTeamsToRepository,
  addTeamToRepository,
  addMemberToTeam,
  addMaintainerToTeam,
  addCodeownersToRepo,
  deleteTeam
};
