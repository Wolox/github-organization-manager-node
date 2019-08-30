const { createRepository: create, addDefaultTeamsToRepository } = require('../services/github');

const createRepository = ({ repositoryName, isPrivate }) =>
  create({ repositoryName, isPrivate }).then(() => addDefaultTeamsToRepository({ repositoryName }));

module.exports = { createRepository };
