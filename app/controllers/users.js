const { getUsers, setRoleToUser } = require('../services/auth0/users');
const { MAINTAINER, ADMIN } = require('../services/auth0/roles');

exports.getUsersHandler = (req, res) => getUsers().then(resp => res.send(resp));
exports.setUserMaintainerHandler = (req, res) =>
  setRoleToUser(req.params.userId, MAINTAINER.roleId).then(resp => res.send(resp));
exports.setUserAdminHandler = (req, res) =>
  setRoleToUser(req.params.userId, ADMIN.roleId).then(resp => res.send(resp));
