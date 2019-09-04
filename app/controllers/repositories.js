const {
  createRepository: create,
  addTeamToRepo: addTeamToRepoGithub,
  getRepositories: getRepositoriesGithub,
  addCodeownersToRepo: addCodeownersToRepoGithub,
  addUser
} = require('../interactors/github');

const { createRepositorySerializer, getRepositoriesSerializer } = require('../serializers/repositories');

const getAllRepositoriesFunction = async type => {
  let actualFetch = await getRepositoriesGithub({
    typeOfRepos: type || 'all',
    perPage: 100,
    pageNumber: 1
  });
  const fetchAll = actualFetch;

  let pageNumber = 2;

  while (actualFetch.repositories.length === 100) {
    actualFetch = await getRepositoriesGithub({
      typeOfRepos: type || 'all',
      perPage: 100,
      pageNumber
    });

    fetchAll.repositories = fetchAll.repositories.concat(actualFetch.repositories);
    pageNumber++;
  }
  return fetchAll;
};

const getRepositories = (req, res) => {
  if (!(req.query && req.query.limit) && !(req.query && req.query.page))
    return getAllRepositoriesFunction().then(resp => res.send(resp));

  return getRepositoriesGithub({
    typeOfRepos: req.query.type || 'all',
    perPage: req.query.limit || 50,
    pageNumber: req.query.page || 0
  }).then(resp => res.send(resp));
};

const createRepository = (req, res) =>
  req.body.techs
    ? Promise.all(
        req.body.techs.map(tech =>
          create({
            repositoryName: `${req.body.repositoryName}-${tech}`,
            isPrivate: req.body.isPrivate
          })
        )
      )
        .then(responses => res.status(200).send(responses))
        .catch(err => res.status(500).send(err))
    : create({
        repositoryName: `${req.body.repositoryName}`,
        isPrivate: req.body.isPrivate
      })
        .then(resp => {
          const response = createRepositorySerializer(resp);
          return res.status(response.statusCode).send(response.body);
        })
        .catch(err => res.status(500).send(err));

const addTeamToRepo = (req, res) =>
  addTeamToRepoGithub(req.body.teamId, req.params.repoName).then(resp => res.send(resp));

const addCodeownersToRepo = (req, res) =>
  addCodeownersToRepoGithub(req.params.repoName, req.body.codeowners).then(resp => res.send(resp));

const addUserToOrganization = (req, res) => addUser(req.params.username).then(resp => res.send(resp));

module.exports = {
  createRepository,
  addTeamToRepo,
  getRepositories,
  addCodeownersToRepo,
  addUserToOrganization
};
