const org = require('./index');
const { github: githubConfig } = require('../../../config').common;

const getTeams = (page, limit) =>
  org.teams.list({
    org: githubConfig.woloxOrganizationName,
    page: page || 1,
    per_page: limit || 100
  });

const createTeam = name =>
  org.teams
    .create({
      org: githubConfig.woloxOrganizationName,
      name
    })
    .then(resp => resp.data);

const addMemberToTeam = ({ teamId, username }) =>
  org.teams
    .addMember({
      team_id: teamId,
      username
    })
    .then(resp => resp.data);

const addMaintainerToTeam = ({ teamId, username }) =>
  org.teams
    .addOrUpdateMembership({
      team_id: teamId,
      role: 'maintainer',
      username
    })
    .then(resp => resp.data);

const deleteTeam = ({ teamId }) =>
  org.teams
    .delete({
      team_id: teamId
    })
    .then(resp => resp.data);

module.exports = { getTeams, createTeam, addMemberToTeam, addMaintainerToTeam, deleteTeam };
