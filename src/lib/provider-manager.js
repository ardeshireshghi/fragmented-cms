const { createService } = require('./providers/factory');

exports.ServiceProviderManager = (config) => {
  const services = {};
  const paramsProvider = {
    git() {
      return {
        remoteOrigin: config.git.remote,
        localPath: config.git.local
      };
    },
    s3() {
      if (!config.s3 || !config.s3.bucket) {
        throw new Error('S3 Bucket name can not be found in config');
      }
      return {
        bucketName: config.s3.bucket
      };
    },
    wordpress() {
      if (!config.wordpress || !config.wordpress.url) {
        throw new Error('Wordpress URL can not be found in config');
      }
      return {
        url: config.wordpress.url
      };
    }
  };

  async function getService(backendName) {
    if (!(backendName in services)) {
      services[backendName] = createService(backendName, paramsProvider[backendName]());

      if (backendName === 'git') {
        await services[backendName].fetch();
      }
    }

    return services[backendName];
  }

  return {
    getService
  };
};
