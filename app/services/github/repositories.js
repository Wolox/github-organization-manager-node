const org = require('./index');
const { github: githubConfig } = require('../../../config').common;

const getRepositories = () =>
  org.repos.list({
    org: githubConfig.woloxOrganizationName
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

const generateCodeownersContent = codeowners => `*       ${codeowners.map(co => `@${co}`).join(' ')}`;
const addCodeownersToRepo = async ({ repositoryName, codeowners }) => {
  const base = 'master';
  const changes = {
    files: {
      CODEOWNERS: generateCodeownersContent(codeowners)
    },
    commit: 'Added CODEOWNERS file'
  };

  let response = await org.repos.listCommits({
    owner: githubConfig.woloxOrganizationName,
    repo: repositoryName,
    sha: base,
    per_page: 1
  });
  let latestCommitSha = response.data[0].sha;
  const treeSha = response.data[0].commit.tree.sha;

  response = await org.git.createTree({
    owner: githubConfig.woloxOrganizationName,
    repo: repositoryName,
    base_tree: treeSha,
    tree: Object.keys(changes.files).map(path => ({
      path,
      mode: '100644',
      content: changes.files[path]
    }))
  });
  const newTreeSha = response.data.sha;

  response = await org.git.createCommit({
    owner: githubConfig.woloxOrganizationName,
    repo: repositoryName,
    message: changes.commit,
    tree: newTreeSha,
    parents: [latestCommitSha]
  });
  latestCommitSha = response.data.sha;

  return org.git.updateRef({
    owner: githubConfig.woloxOrganizationName,
    repo: repositoryName,
    sha: latestCommitSha,
    ref: 'heads/master'
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
