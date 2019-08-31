const org = require('./index');
const { github: githubConfig } = require('../../../config').common;

const getReference = ({ repositoryName, branchName }) =>
  org.git.getRef({
    owner: githubConfig.woloxOrganizationName,
    repo: repositoryName,
    ref: `heads/${branchName}`
  });

const createBranchFromMaster = ({ repositoryName, branchName }) =>
  getReference({ repositoryName, branchName: 'master' }).then(master =>
    org.git.createRef({
      owner: githubConfig.woloxOrganizationName,
      repo: repositoryName,
      ref: `refs/heads/${branchName}`,
      sha: master.data.object.sha
    })
  );

module.exports = { createBranchFromMaster };
