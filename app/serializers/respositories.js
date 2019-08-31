const createRepositorySerializer = response => ({
  statusCode: response.status,
  body: response.data
});

module.exports = { createRepositorySerializer };
