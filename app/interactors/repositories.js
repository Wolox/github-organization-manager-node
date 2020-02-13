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

const execDefaultRepositoryActions = ({ repositoryName }) =>
  Promise.all([
    addDefaultTeamsToRepository({ repositoryName }),
    createBranchFromMaster({ repositoryName, ...DEVELOPMENT_BRANCH }),
    createBranchFromMaster({ repositoryName, ...STAGE_BRANCH }),
    updateBranchProtection({ repositoryName, ...MASTER_BRANCH })
  ]);

const createRepository = ({ repositoryName, isPrivate }) =>
  createRepositoryGithub({ repositoryName, isPrivate }).then(({ repository, quotaLeft }) =>
    execDefaultRepositoryActions({ repositoryName })
      .then(() => {
        const lowQuota = quotaLeft <= lowQuotaThreshold;
        if (isPrivate && lowQuota) {
          sendRawEmail({ body: '', subject: '', to: '' });
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
