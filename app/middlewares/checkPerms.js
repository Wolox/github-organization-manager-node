module.exports = (expectedScopes, options) => {
  if (!Array.isArray(expectedScopes)) {
    throw new Error(
      'Parameter expectedScopes must be an array of strings representing the scopes for the endpoint(s)'
    );
  }

  // eslint-disable-next-line complexity
  return (req, res, next) => {
    const error = resp => {
      const err_message = 'Insufficient scope';

      if (options && options.failWithError) {
        return next({
          statusCode: 403,
          error: 'Forbidden',
          message: err_message
        });
      }

      resp.append('WWW-Authenticate', `Bearer scope="${expectedScopes.join(' ')}", error="${err_message}"`);
      return resp.status(403).send(err_message);
    };

    if (expectedScopes.length === 0) {
      return next();
    }

    let userScopes = [];
    let scopeKey = 'permissions';
    if (options && options.customScopeKey !== null && typeof options.customScopeKey === 'string') {
      scopeKey = options.customScopeKey;
    }

    if (!req.user) {
      return error(res);
    }

    if (typeof req.user[scopeKey] === 'string') {
      userScopes = req.user[scopeKey].split(' ');
    } else if (Array.isArray(req.user[scopeKey])) {
      userScopes = req.user[scopeKey];
    } else {
      return error(res);
    }

    let allowed = false;
    if (options && options.checkAllScopes) {
      allowed = expectedScopes.every(scope => userScopes.includes(scope));
    } else {
      allowed = expectedScopes.some(scope => userScopes.includes(scope));
    }

    return allowed ? next() : error(res);
  };
};
