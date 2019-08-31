const {
  createRepository: create,
  addTeamToRepo: addTeamToRepoGithub,
  getRepositories: getRepositoriesGithub,
  addCodeownersToRepo: addCodeownersToRepoGithub,
  addUser
} = require('../interactors/github');

const { createRepositorySerializer } = require('../serializers/respositories');

const createRepository = (req, res) =>
  req.body.techs
    ? Promise.all(
      req.body.techs.map(tech =>
        create({
          repositoryName: `${req.body.repositoryName}-${tech}`,
          isPrivate: req.body.isPrivate
        })
      )
    ).then(() => res.status(201).end())
    : create({
      repositoryName: `${req.body.repositoryName}`,
      isPrivate: req.body.isPrivate
    }).then(resp => {
      const response = createRepositorySerializer(resp);
      return res.status(response.statusCode).send(response.body);
    });

const addTeamToRepo = (req, res) =>
  addTeamToRepoGithub(req.body.teamId, req.params.repoName).then(resp => res.send(resp));

const getRepositories = (req, res) => getRepositoriesGithub().then(resp => res.send(resp));

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
