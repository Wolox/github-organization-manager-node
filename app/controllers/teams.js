const github = require('../interactors/github');

const getTeams = (req, res) => github.getTeams().then(resp => res.send(resp));
const createTeam = (req, res) => github.createTeam(req.body.name).then(resp => res.send(resp));
const deleteTeam = (req, res) => github.deleteTeam(req.params.teamId).then(resp => res.send(resp));
const addMembersToTeam = (req, res) =>
  Promise.all(req.body.usernames.map(user => github.addMemberToTeam(req.params.teamId, user))).then(resp =>
    res.send(resp)
  );

module.exports = { getTeams, createTeam, addMembersToTeam, deleteTeam };
