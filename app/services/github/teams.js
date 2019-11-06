const org = require('./index');
const { github: githubConfig } = require('../../../config').common;

const getTeams = (page, limit) =>
  org.teams.list({
    org: githubConfig.woloxOrganizationName,
    page: page || 0,
    per_page: limit || 100
  });

const createTeam = name =>
  org.teams.create({
    org: githubConfig.woloxOrganizationName,
    name
  });

const addMemberToTeam = ({ teamId, username }) =>
  org.teams.addMember({
    team_id: teamId,
    username
  });

const deleteTeam = ({ teamId }) =>
  org.teams.delete({
    team_id: teamId
  });

module.exports = { getTeams, createTeam, addMemberToTeam, deleteTeam };
