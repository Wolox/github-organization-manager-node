const org = require('./index');
const { github: githubConfig } = require('../../../config').common;
const { MASTER_BRANCH } = require('./branches');
const { createCommit } = require('./commits');

const getRepositories = ({ pageNumber, typeOfRepos, perPage }) =>
  org.repos.list({
    org: githubConfig.woloxOrganizationName,
    per_page: perPage,
    page: pageNumber,
    type: typeOfRepos
  });

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

const addMemberToTeam = ({ teamId, username }) =>
  org.teams.addMember({
    team_id: teamId,
    username
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
  addDefaultTeamsToRepository,
  addTeamToRepository,
  addMemberToTeam,
  addCodeownersToRepo
};
