const org = require('./index');
const { github: githubConfig } = require('../../../config').common;

const getTeams = () =>
  org.teams.list({
    org: githubConfig.woloxOrganizationName
  });

const createTeam = name =>
  org.teams.create({
    org: githubConfig.woloxOrganizationName,
    name
  });

module.exports = { getTeams, createTeam };
