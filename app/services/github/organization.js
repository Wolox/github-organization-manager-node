const org = require('./index');
const { github: githubConfig } = require('../../../config').common;

const addUser = username =>
  org.orgs.addOrUpdateMembership({
    org: githubConfig.woloxOrganizationName,
    username,
    // this is harcoded and will always be
    role: 'member'
  });

module.exports = { addUser };
