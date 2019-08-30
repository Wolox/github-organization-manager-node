const app = require('./app');
const config = require('./config');
const logger = require('./app/logger');

const port = config.common.api.port || 8080;

Promise.resolve()

  .then(() => {
    app.listen(port);

    logger.info(`Listening on port: ${port}`);
  })
  .catch(logger.error);
