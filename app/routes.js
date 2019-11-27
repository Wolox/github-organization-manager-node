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
const { adminScope } = require('./middlewares/checkScope');

exports.init = app => {
  app.get('/health', healthCheck);

  app.get('/search/repositories', searchRepositories);
  app.get('/repositories', getRepositories);
  app.post('/repositories', createRepository);
  app.post('/organization/:username', addUserToOrganization);

  app.post('/repositories/:repoName/teams', addTeamToRepo);

  app.post('/repositories/:repoName/codeowners', addCodeownersToRepo);

  app.get('/teams', getTeams);
  app.post('/teams', createTeam);
  app.post('/teams/:teamId/members', addMembersToTeam);
  app.delete('/teams/:teamId', deleteTeam);

  app.get('/users', checkJwt, getUsersHandler);
  app.post('/users/:userId/maintainer', checkJwt, setUserMaintainerHandler);
  app.post('/users/:userId/admin', checkJwt, setUserAdminHandler);

  app.get('/api/public', (req, res) => {
    res.json({
      message: "Hello from a public endpoint! You don't need to be authenticated to see this."
    });
  });

  app.get('/api/private', checkJwt, (req, res) => {
    res.json({
      message: 'Hello from a private endpoint! You need to be authenticated to see this.'
    });
  });

  app.get('/api/private-scoped', checkJwt, adminScope, (req, res) => {
    res.json({
      message:
        'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
    });
  });
};
