const { createService } = require('./providers/factory');

exports.ServiceProviderManager = (config) => {
  const services = {};

  async function getService(backendName) {
    if (!(backendName in services)) {
      let params;

      if (backendName === 'git') {
        params = {
          remoteOrigin: config.git.remote,
          localPath: config.git.local
        };
      } else if (backendName === 's3') {
        if (!config.s3 || !config.s3.bucket) {
          throw new Error('S3 Bucket name can not be found in config');
        }
        params = {
          bucketName: config.s3.bucket
        };
      } else {
        throw new Error(`${backendName} service is not implemented`);
      }

      services[backendName] = createService(backendName, params);

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
