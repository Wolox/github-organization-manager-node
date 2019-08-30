const jwtAuthz = require('express-jwt-authz');

exports.adminScope = jwtAuthz(['read:messages']);
exports.techLeaderScope = jwtAuthz(['read:messages']);
exports.devScope = jwtAuthz(['read:messages']);
