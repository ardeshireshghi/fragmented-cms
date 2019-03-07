const { createService } = require('./providers/factory');

function serviceParams(backendName, config) {
  if (backendName === 'git') {
    return {
      remoteOrigin: config.git.remote,
      localPath: config.git.local
    };
  }

  if (backendName === 's3') {
    if (!config.s3 || !config.s3.bucket) {
      throw new Error('S3 Bucket name can not be found in config');
    }
    return {
      bucketName: config.s3.bucket
    };
  }

  if (backendName === 'wordpress') {
    if (!config.wordpress || !config.wordpress.url) {
      throw new Error('Wordpress URL can not be found in config');
    }
    return {
      url: config.wordpress.url
    };
  }

  throw new Error(`${backendName} service is not implemented`);
}

exports.ServiceProviderManager = (config) => {
  const services = {};

  async function getService(backendName) {
    if (!(backendName in services)) {
      services[backendName] = createService(backendName, serviceParams(backendName, config));

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
