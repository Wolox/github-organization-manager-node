const { healthCheck } = require('./controllers/healthCheck');
const {
  createRepository,
  addTeamToRepo,
  getRepositories,
  searchRepositories,
  addCodeownersToRepo
} = require('./controllers/repositories');
const { addUserToOrganization } = require('./controllers/organization');
const {
  getTeams,
  createTeam,
  addMembersToTeam,
  addMaintainersToTeam,
  deleteTeam
} = require('./controllers/teams');

const { getUsersHandler, setUserMaintainerHandler, setUserAdminHandler } = require('./controllers/users.js');
const checkJwt = require('./middlewares/checkAuth');
const checkPerms = require('./middlewares/checkPerms');

exports.init = app => {
  app.get('/health', healthCheck);

  app.get('/search/repositories', checkJwt, searchRepositories);
  app.get('/repositories', checkJwt, getRepositories);
  app.post('/repositories', checkJwt, checkPerms(['create:repo']), createRepository);
  app.post('/repositories/:repoName/teams', checkJwt, checkPerms(['create:repo']), addTeamToRepo);
  app.post('/repositories/:repoName/codeowners', checkJwt, checkPerms(['create:repo']), addCodeownersToRepo);

  app.post('/organization/:username', checkJwt, checkPerms(['add:user:org']), addUserToOrganization);

  app.get('/teams', checkJwt, checkPerms(['manage:teams']), getTeams);
  app.post('/teams', checkJwt, checkPerms(['manage:teams']), createTeam);
  app.post('/teams/:teamId/members', checkJwt, checkPerms(['manage:teams']), addMembersToTeam);
  app.post('/teams/:teamId/maintainers', checkJwt, checkPerms(['manage:teams']), addMaintainersToTeam);
  app.delete('/teams/:teamId', checkJwt, checkPerms(['manage:teams']), deleteTeam);

  app.get('/users', checkJwt, checkPerms(['add:role']), getUsersHandler);
  app.post('/users/:userId/techlead', checkJwt, checkPerms(['add:role']), setUserMaintainerHandler);
  app.post('/users/:userId/admin', checkJwt, checkPerms(['add:role']), setUserAdminHandler);
};
