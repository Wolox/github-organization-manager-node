const org = require('./index');
const { github: githubConfig } = require('../../../config').common;

const getTeams = (page, limit) =>
  org.teams.list({
    org: githubConfig.woloxOrganizationName,
    page: page || 1,
    per_page: limit || 100
  });

const createTeam = name =>
  org.teams.create({
    org: githubConfig.woloxOrganizationName,
    name
  });

module.exports = { getTeams, createTeam };
