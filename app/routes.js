// const controller = require('./controllers/controller');
const { healthCheck } = require('./controllers/healthCheck');
const checkJwt = require('./middlewares/checkAuth');
const { adminScope } = require('./middlewares/checkScope');

exports.init = app => {
  app.get('/health', healthCheck);

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
