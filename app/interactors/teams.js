const {
  getTeams,
  createTeam: createTeamGithub,
  addMemberToTeam: addMemberToTeamGithub,
  addMaintainerToTeam: addMaintainerToTeamGithub,
  deleteTeam: deleteTeamGithub
} = require('../services/github/teams');

const createTeam = name => createTeamGithub(name).then(resp => resp.data);

const addMemberToTeam = (teamId, username) =>
  addMemberToTeamGithub({ teamId, username }).then(resp => resp.data);

const addMaintainerToTeam = (teamId, username) =>
  addMaintainerToTeamGithub({ teamId, username }).then(resp => resp.data);

const deleteTeam = teamId => deleteTeamGithub({ teamId }).then(resp => resp.data);

module.exports = {
  getTeams,
  createTeam,
  addMemberToTeam,
  addMaintainerToTeam,
  deleteTeam
};
