const org = require('./index');
const { github: githubConfig } = require('../../../config').common;

exports.createCommit = async ({ repositoryName, base = 'master', changes }) => {
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
    ref: `heads/${base}`
  });
};
