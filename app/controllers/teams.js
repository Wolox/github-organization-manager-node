const {
  getTeams: getTeamsGithub,
  createTeam: createTeamGithub,
  deleteTeam: deleteTeamGithub,
  addMemberToTeam: addMemberToTeamGithub
} = require('../interactors/github');

const getTeams = (req, res) =>
  getTeamsGithub({
    perPage: req.query.limit || 50,
    pageNumber: req.query.page || 0
  }).then(resp => res.send(resp));

const createTeam = (req, res) => createTeamGithub(req.body.name).then(resp => res.send(resp));
const deleteTeam = (req, res) => deleteTeamGithub(req.params.teamId).then(resp => res.send(resp));
const addMembersToTeam = (req, res) =>
  Promise.all(req.body.usernames.map(user => addMemberToTeamGithub(req.params.teamId, user))).then(resp =>
    res.send(resp)
  );

module.exports = { getTeams, createTeam, addMembersToTeam, deleteTeam };
