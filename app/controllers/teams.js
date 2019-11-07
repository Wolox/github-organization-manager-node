const {
  createTeam: createTeamGithub,
  getTeams: getTeamsGithub,
  addMemberToTeam: addMemberToTeamGithub,
  deleteTeam: deleteTeamGithub
} = require('../interactors/teams');

const getTeams = (req, res) => getTeamsGithub(req.query.page, req.query.limit).then(resp => res.send(resp));
const createTeam = (req, res) => createTeamGithub(req.body.name).then(resp => res.send(resp));
const deleteTeam = (req, res) => deleteTeamGithub(req.params.teamId).then(resp => res.send(resp));
const addMembersToTeam = (req, res) =>
  Promise.all(req.body.usernames.map(user => addMemberToTeamGithub(req.params.teamId, user))).then(resp =>
    res.send(resp)
  );

module.exports = { getTeams, createTeam, addMembersToTeam, deleteTeam };
