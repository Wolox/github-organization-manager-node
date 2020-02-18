const sgMail = require('@sendgrid/mail');
const { email: emailConfig } = require('../../../config').common;

sgMail.setApiKey(emailConfig.sendGridApiKey);

module.exports = sgMail;
