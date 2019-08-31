const { createRepository: create, addDefaultTeamsToRepository } = require('../services/github/repositories');

const createRepository = ({ repositoryName, isPrivate }) =>
  create({ repositoryName, isPrivate }).then(repository =>
    addDefaultTeamsToRepository({ repositoryName }).then(() => repository)
  );

module.exports = { createRepository };
