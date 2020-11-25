/* eslint-disable */

const path = require('path');
const fsp = require('fs').promises;

module.exports = (shipit) => {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);
  require('dotenv').config();

  const appName = 'choc-etc-stock';

  shipit.initConfig({
    default: {
      deployTo: process.env.DEPLOY_PATH,
      repositoryUrl: 'https://github.com/GeneralQuarter/cho-etc-stock-back.git',
      keepReleases: 2,
      shared: {
        overwrite: true,
        dirs: ['node_modules'],
      },
    },
    production: {
      servers: process.env.DEPLOY_SERVER,
    },
  });

  const ecosystemFilePath = path.join(
    shipit.config.deployTo,
    'shared',
    'ecosystem.config.js',
  );

  shipit.on('updated', async () => {
    shipit.start('npm-install', 'copy-config');
  });

  shipit.on('published', async () => {
    shipit.start('pm2-server');
  });

  shipit.blTask('copy-config', async () => {
    const ecosystem = `
module.exports = {
  apps: [
    {
      name: '${appName}',
      script: '${shipit.releasePath}/dist/index.js',
      watch: true,
      autorestart: true,
      restart_delay: 1000,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};`;

    await fsp.writeFile('ecosystem.config.js', ecosystem, 'utf-8');
    await shipit.copyToRemote('ecosystem.config.js', ecosystemFilePath);
  });

  shipit.blTask('npm-install', async () => {
    shipit.remote(`cd ${shipit.releasePath} && npm install --production`);
  });

  shipit.blTask('pm2-server', async () => {
    await shipit.remote(`pm2 delete -s ${appName} || :`);
    await shipit.remote(
      `pm2 start ${ecosystemFilePath} --env production --watch true`
    );
  });
};
