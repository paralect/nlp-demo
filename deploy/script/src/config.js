const path = require('path');
const rootDir = path.resolve(__dirname, './../../../');

const deployConfig =  {
  api: { dockerRepo: 'paralect/common', dir: `${rootDir}/api` },
  web: { dockerRepo: 'paralect/common', dir: `${rootDir}/web` },
};

Object.keys(deployConfig).forEach(serviceName => {
if (!deployConfig[serviceName].dockerFilePath) {
    deployConfig[serviceName].dockerFilePath = `${deployConfig[serviceName].dir}/Dockerfile`;
  }
  if (!deployConfig[serviceName].dockerContextDir) {
    deployConfig[serviceName].dockerContextDir = deployConfig[serviceName].dir;
  }
});

const ENV = process.env;

module.exports = {
  rootDir,

  service: ENV.SERVICE,

  namespace: ENV.NAMESPACE || 'nlp',

  kubeConfig: ENV.KUBE_CONFIG,

  home: ENV.HOME,

  dockerRegistry: {
    username: ENV.DOCKER_AUTH_USERNAME,
    password: ENV.DOCKER_AUTH_PASSWORD,

    imageTag: ENV.IMAGE_TAG,
  },

  deploy: deployConfig,
};
