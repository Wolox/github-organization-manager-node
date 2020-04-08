const {
  createRepository: createRepositoryGithub,
  addTeamToRepo: addTeamToRepoGithub,
  getRepositories: getRepositoriesGithub,
  searchRepositories: searchRepositoriesGithub,
  addCodeownersToRepo: addCodeownersToRepoGithub
} = require('../interactors/repositories');

const {
  createRepositorySerializer,
  getRepositoriesSerializer,
  getSearchReposSerializer
} = require('../serializers/repositories');

const createRepository = (req, res) =>
  req.body.techs
    ? Promise.all(
        req.body.techs.map(tech =>
          createRepositoryGithub({
            repositoryName: `${req.body.repositoryName}-${tech}`,
            isPrivate: req.body.isPrivate
          })
        )
      )
        .then(responses => res.status(200).send(responses))
        .catch(err => res.status(err.status || 500).send(err))
    : createRepositoryGithub({
        repositoryName: `${req.body.repositoryName}`,
        isPrivate: req.body.isPrivate
      })
        .then(resp => {
          const response = createRepositorySerializer(resp);
          return res.status(response.statusCode).send(response.body);
        })
        .catch(err => res.status(err.status || 500).send(err));

const addTeamToRepo = (req, res) =>
  addTeamToRepoGithub(req.body.teamId, req.params.repoName).then(resp => res.send(resp));

const getRepositories = (req, res) =>
  getRepositoriesGithub({
    pageNumber: req.query.page || 1,
    typeOfRepos: req.query.type || 'all',
    perPage: req.query.limit || 100
  }).then(resp => res.send({ data: getRepositoriesSerializer(resp), page: req.query.page }));

const searchRepositories = (req, res) =>
  searchRepositoriesGithub({
    pageNumber: req.query.page || 1,
    query: req.query.query || '',
    perPage: req.query.limit || 100
  }).then(resp => res.send({ data: getSearchReposSerializer(resp), page: req.query.page }));

const addCodeownersToRepo = (req, res) =>
  addCodeownersToRepoGithub(req.params.repoName, req.body.codeowners).then(resp => res.send(resp));

module.exports = {
  createRepository,
  addTeamToRepo,
  getRepositories,
  searchRepositories,
  addCodeownersToRepo
};
