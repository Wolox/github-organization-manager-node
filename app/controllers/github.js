const { createRepository: create } = require('../interactors/github');

const createRepository = (req, res) =>
  create({
    repositoryName: req.body.repositoryName,
    isPrivate: req.body.isPrivate
  }).then(resp => res.send(resp));

module.exports = { createRepository };
