const github = require('../interactors/github');

const getTeams = (req, res) => github.getTeams().then(resp => res.send(resp));
const createTeam = (req, res) => github.createTeam(req.body.name).then(resp => res.send(resp));
const addMemberToTeam = (req, res) =>
  github.addMemberToTeam(req.params.teamId, req.body.username).then(resp => res.send(resp));

module.exports = { getTeams, createTeam, addMemberToTeam };
