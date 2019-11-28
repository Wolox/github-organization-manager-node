const jwtAuthz = require('express-jwt-authz');
const {
  createRepository,
  addTeamToRepo,
  getRepositories,
  searchRepositories,
  addCodeownersToRepo,
  addUserToOrganization
} = require('./controllers/github');
const { getTeams, createTeam, addMembersToTeam, deleteTeam } = require('./controllers/teams');
const { healthCheck } = require('./controllers/healthCheck');
const { getUsersHandler, setUserMaintainerHandler, setUserAdminHandler } = require('./controllers/users.js');
const checkJwt = require('./middlewares/checkAuth');

exports.init = app => {
  app.get('/health', healthCheck);

  app.get('/search/repositories', checkJwt, searchRepositories);
  app.get('/repositories', checkJwt, getRepositories);

  app.post('/repositories', checkJwt, jwtAuthz(['create:repo']), createRepository);
  app.post('/repositories/:repoName/teams', checkJwt, jwtAuthz(['create:repo']), addTeamToRepo);
  app.post('/repositories/:repoName/codeowners', checkJwt, jwtAuthz(['create:repo']), addCodeownersToRepo);

  app.post('/organization/:username', checkJwt, jwtAuthz(['add:user:org']), addUserToOrganization);

  app.get('/teams', checkJwt, jwtAuthz(['manage:teams']), getTeams);
  app.post('/teams', checkJwt, jwtAuthz(['manage:teams']), createTeam);
  app.post('/teams/:teamId/members', checkJwt, jwtAuthz(['manage:teams']), addMembersToTeam);
  app.delete('/teams/:teamId', checkJwt, jwtAuthz(['manage:teams']), deleteTeam);

  app.get('/users', checkJwt, jwtAuthz(['add:role']), getUsersHandler);
  app.post('/users/:userId/techlead', checkJwt, jwtAuthz(['add:role']), setUserMaintainerHandler);
  app.post('/users/:userId/admin', checkJwt, jwtAuthz(['add:role']), setUserAdminHandler);
};
