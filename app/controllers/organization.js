const { addUser } = require('../services/github/organization');

const addUserToOrganization = (req, res) => addUser(req.params.username).then(resp => res.send(resp));

module.exports = { addUserToOrganization };
