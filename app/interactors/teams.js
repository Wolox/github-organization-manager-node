const {
  getTeams,
  createTeam: createTeamGithub,
  addMemberToTeam: addMemberToTeamGithub,
  addMaintainerToTeam: addMaintainerToTeamGithub,
  deleteTeam: deleteTeamGithub
} = require('../services/github/teams');

const createTeam = name => createTeamGithub(name);

const addMemberToTeam = (teamId, username) => addMemberToTeamGithub({ teamId, username });

const addMaintainerToTeam = (teamId, username) => addMaintainerToTeamGithub({ teamId, username });

const deleteTeam = teamId => deleteTeamGithub({ teamId });

module.exports = {
  getTeams,
  createTeam,
  addMemberToTeam,
  addMaintainerToTeam,
  deleteTeam
};
