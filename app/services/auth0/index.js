const { ManagementClient } = require('auth0');

const management = new ManagementClient({
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN
});

module.exports = management;
