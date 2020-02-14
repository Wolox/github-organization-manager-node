const { inspect } = require('util');

const mailer = require('./index');
const { email } = require('../../../config').common;
const logger = require('../../logger');

exports.sendRawEmail = ({ body, subject, to }) =>
  mailer.send({ to, text: body, html: body, subject, from: email.fromAddress }, to.length > 1).catch(err => {
    logger.error(`Fail to send raw email because of: ${inspect(err)}`);
  });
