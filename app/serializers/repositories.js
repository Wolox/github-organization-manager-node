const createRepositorySerializer = response => ({
  statusCode: response.status,
  body: response.data
});

const getRepositoriesSerializer = response => response.data.map(repo => repo.full_name);
const getSearchReposSerializer = response => response.data.items.map(repo => repo.full_name);

module.exports = { createRepositorySerializer, getRepositoriesSerializer, getSearchReposSerializer };
