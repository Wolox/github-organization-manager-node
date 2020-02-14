const {
  createRepository: createRepositoryGithub,
  addDefaultTeamsToRepository,
  addTeamToRepository,
  addCodeownersToRepo: addCodeownersToRepoGithub,
  getRepositories,
  searchRepositories
} = require('../services/github/repositories');

const {
  createBranchFromMaster,
  updateBranchProtection,
  MASTER_BRANCH,
  DEVELOPMENT_BRANCH,
  STAGE_BRANCH
} = require('../services/github/branches');

const { sendRawEmail } = require('../services/mailer/rawEmail');

const { email: emailConfig, github: githubConfig } = require('../../config').common;

const execDefaultRepositoryActions = ({ repositoryName }) =>
  Promise.all([
    addDefaultTeamsToRepository({ repositoryName }),
    createBranchFromMaster({ repositoryName, ...DEVELOPMENT_BRANCH }),
    createBranchFromMaster({ repositoryName, ...STAGE_BRANCH }),
    updateBranchProtection({ repositoryName, ...MASTER_BRANCH })
  ]);

const sendEmailLowQuota = quotaLeft =>
  sendRawEmail({
    body: `${githubConfig.woloxOrganizationName} has ${quotaLeft} private repositories remaining in the organization quota`,
    subject: '[GOM] - Private Repositories Quota is Low',
    to: emailConfig.lowQuotaEmails
  });

const createRepository = ({ repositoryName, isPrivate }) =>
  createRepositoryGithub({ repositoryName, isPrivate }).then(({ repository, quotaLeft }) =>
    execDefaultRepositoryActions({ repositoryName })
      .then(() => {
        const lowQuota = quotaLeft === githubConfig.lowQuotaRepositoriesCount;
        if (isPrivate && lowQuota) {
          sendEmailLowQuota(quotaLeft);
        }
      })
      .then(() => repository)
  );

const addTeamToRepo = (teamId, repositoryName) => addTeamToRepository({ teamId, repositoryName });

const addCodeownersToRepo = (repositoryName, codeowners) =>
  addCodeownersToRepoGithub({ repositoryName, codeowners });

module.exports = {
  createRepository,
  getRepositories,
  searchRepositories,
  addTeamToRepo,
  addCodeownersToRepo
};
