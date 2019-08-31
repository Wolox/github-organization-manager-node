const {
  createRepository: create,
  addTeamToRepo: addTeamToRepoGithub,
  getRepositories: getRepositoriesGithub
} = require('../interactors/github');

const createRepository = (req, res) =>
  create({
    repositoryName: req.body.repositoryName,
    isPrivate: req.body.isPrivate
  }).then(resp => res.send(resp));

const addTeamToRepo = (req, res) =>
  addTeamToRepoGithub(req.body.teamId, req.params.repoName).then(resp => res.send(resp));

const getRepositories = (req, res) => getRepositoriesGithub().then(resp => res.send(resp));

module.exports = { createRepository, addTeamToRepo, getRepositories };
