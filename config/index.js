const ENVIRONMENT = process.env.NODE_ENV || 'development';
const dotenv = require('dotenv');

if (ENVIRONMENT !== 'production') dotenv.config();

const configFile = `./${ENVIRONMENT}`;

const isObject = variable => variable instanceof Object;

/*
 * Deep copy of source object into tarjet object.
 * It does not overwrite properties.
 */
const assignObject = (target, source) => {
  if (target && isObject(target) && source && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(target, key) || target[key] === undefined) {
        target[key] = source[key];
      } else assignObject(target[key], source[key]);
    });
  }
  return target;
};

const config = {
  common: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    api: {
      bodySizeLimit: process.env.API_BODY_SIZE_LIMIT,
      parameterLimit: process.env.API_PARAMETER_LIMIT,
      port: process.env.PORT
    },
    session: {
      header_name: 'authorization',
      secret: process.env.NODE_API_SESSION_SECRET
    },
    headers: {
      apiDate: process.env.API_DATE || 'X-API-Date',
      packageVersion: process.env.PACKAGE_VERSION || 'X-Package-Version',
      nodeVersion: process.env.NODE_VERSION || 'X-Node-Version'
    },
    github: {
      woloxInstallationId: process.env.WOLOX_INSTALLATION_ID,
      appPrivateKey: process.env.GITHUB_APP_PRIVATE_KEY,
      appId: process.env.GITHUB_APP_ID,
      woloxOrganizationName: process.env.WOLOX_ORGANIZATION_NAME || 'Wolox',
      tlsTeamId: process.env.TECHNICAL_LEADERS_TEAM_ID,
      botsTeamId: process.env.BOTS_TEAM_ID,
      qualityTeamId: process.env.QUALITY_TEAM_ID,
      developmentBranchName: process.env.DEVELOPMENT_BRANCH_NAME || 'development',
      stageBranchName: process.env.STAGE_BRANACH_NAME || 'stage'
    }
  }
};

const customConfig = require(configFile).config;
module.exports = assignObject(customConfig, config);
