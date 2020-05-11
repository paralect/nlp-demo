const mount = require('koa-mount');

// const accountResource = require('resources/account/public');
const healthResource = require('resources/health/public');
const processingResource = require('resources/processing');


module.exports = (app) => {
  // app.use(mount('/account', accountResource));
  app.use(mount('/health', healthResource));
  app.use(mount('/processing', processingResource));
};
