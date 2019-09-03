const user = require('./user');
const repositories = require('./repositories');
const teams = require('./teams');

module.exports = {
  ...user,
  ...repositories,
  ...teams
};
