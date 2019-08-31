const { repositoryMapper } = require('../mappers/listAllRepos');
const { getRepositories } = require('../../app/services/github/repositories');

const countRepositories = async ({ type }) => {
  const fetch1 = await getRepositories({ page: '0', type });
  const fetch2 = await getRepositories({ page: '1', type });

  const mappedFetch1 = repositoryMapper(fetch1);
  const mappedFetch2 = repositoryMapper(fetch2);

  return mappedFetch1.concat(mappedFetch2).length;
};

module.exports = { countRepositories };
