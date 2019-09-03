const org = require('./index');
const { github: githubConfig } = require('../../../config').common;

const getTeams = ({ perPage, pageNumber }) =>
  org.teams.list({
    org: githubConfig.woloxOrganizationName,
    per_page: perPage,
    page: pageNumber
  });

const createTeam = name =>
  org.teams.create({
    org: githubConfig.woloxOrganizationName,
    name
  });

module.exports = { getTeams, createTeam };
