const {
  getTeams: getTeamsGithub,
  createTeam: createTeamGithub,
  addMemberToTeam: addMemberToTeamGithub,
  deleteTeam: deleteTeamGithub
} = require('../services/github/teams');

const getTeams = (page, limit) =>
  getTeamsGithub(page, limit).then(resp => ({ teams: resp.data.map(({ name, id }) => ({ name, id })) }));

const createTeam = name => createTeamGithub(name).then(resp => resp.data);

const addMemberToTeam = (teamId, username) =>
  addMemberToTeamGithub({ teamId, username }).then(resp => resp.data);

const deleteTeam = teamId => deleteTeamGithub({ teamId }).then(resp => resp.data);

module.exports = {
  getTeams,
  createTeam,
  addMemberToTeam,
  deleteTeam
};
