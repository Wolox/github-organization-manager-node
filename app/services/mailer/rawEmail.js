const { inspect } = require('util');

const mailer = require('./index');
const logger = require('../../logger');

exports.sendRawEmail = ({ body, subject, to }) =>
  mailer.send({ to, text: body, subject, from: 'om@wolox.com.ar' }).catch(err => {
    logger.error(`Fail to send raw email because of: ${inspect(err)}`);
  });
