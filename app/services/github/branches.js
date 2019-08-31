/* eslint-disable id-length */
const org = require('./index');
const { github: githubConfig } = require('../../../config').common;

const { developmentBranchName, stageBranchName } = githubConfig;

const STAGE_BRANCH = {
  branchName: stageBranchName,
  needCodeOwnerApprove: true,
  approvesQuantityToMerge: 1
};

const DEVELOPMENT_BRANCH = {
  branchName: developmentBranchName,
  needCodeOwnerApprove: false,
  approvesQuantityToMerge: 2
};

const MASTER_BRANCH = {
  branchName: 'master',
  needCodeOwnerApprove: false,
  approvesQuantityToMerge: 2
};

const getBranchProtections = ({ needCodeOwnerApprove, approvesQuantityToMerge }) => ({
  required_status_checks: {
    contexts: [],
    strict: true
  },
  required_pull_request_reviews: {
    dismiss_stale_reviews: true,
    require_code_owner_reviews: needCodeOwnerApprove,
    required_approving_review_count: approvesQuantityToMerge
  },
  enforce_admins: false,
  restrictions: null
});

const getReference = ({ repositoryName, branchName }) =>
  org.git.getRef({
    owner: githubConfig.woloxOrganizationName,
    repo: repositoryName,
    ref: `heads/${branchName}`
  });

const updateBranchProtection = ({
  repositoryName,
  branchName,
  needCodeOwnerApprove,
  approvesQuantityToMerge
}) =>
  org.repos.updateBranchProtection({
    owner: githubConfig.woloxOrganizationName,
    repo: repositoryName,
    branch: branchName,
    ...getBranchProtections({ needCodeOwnerApprove, approvesQuantityToMerge })
  });

const createBranchFromMaster = ({
  repositoryName,
  branchName,
  needCodeOwnerApprove,
  approvesQuantityToMerge
}) =>
  getReference({ repositoryName, branchName: 'master' }).then(master =>
    org.git
      .createRef({
        owner: githubConfig.woloxOrganizationName,
        repo: repositoryName,
        ref: `refs/heads/${branchName}`,
        sha: master.data.object.sha
      })
      .then(() =>
        updateBranchProtection({
          repositoryName,
          branchName,
          needCodeOwnerApprove,
          approvesQuantityToMerge
        })
      )
  );

module.exports = {
  createBranchFromMaster,
  updateBranchProtection,
  DEVELOPMENT_BRANCH,
  STAGE_BRANCH,
  MASTER_BRANCH
};
