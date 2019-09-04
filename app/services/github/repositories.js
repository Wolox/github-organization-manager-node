const org = require('./index');
const { github: githubConfig } = require('../../../config').common;
const { MASTER_BRANCH } = require('./branches');
const { createCommit } = require('./commits');

const getRepositories = ({ pageNumber, typeOfRepos, perPage }) =>
  org.repos.list({
    org: githubConfig.woloxOrganizationName,
    type: typeOfRepos,
    per_page: perPage,
    page: pageNumber
  });

const countRepositories = async ({ type }) => {
  const fetch1 = await getRepositories({ page: '0', type });
  const fetch2 = await getRepositories({ page: '1', type });

  const mappedFetch1 = fetch1.data.map(repo => repo.name);
  const mappedFetch2 = fetch2.data.map(repo => repo.name);

  return mappedFetch1.concat(mappedFetch2).length;
};

const createRepository = ({ repositoryName, isPrivate }) =>
  countRepositories({ type: 'private' }).then(count =>
    count < 125
      ? org.repos.createInOrg({
          auto_init: true,
          org: githubConfig.woloxOrganizationName,
          name: repositoryName,
          private: isPrivate
        })
      : Promise.reject(
          `No more private repositories can be created: quota limit, current private repos: ${count}`
        )
  );

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
  addDefaultTeamsToRepository,
  addTeamToRepository,
  addCodeownersToRepo
};
