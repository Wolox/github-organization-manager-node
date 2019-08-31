const auth0 = require('./index');

exports.getUsers = () => auth0.getUsers();

exports.setRoleToUser = (userId, roleId) => auth0.assignRolestoUser({ id: userId }, { roles: [roleId] });
