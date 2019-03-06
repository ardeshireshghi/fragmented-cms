const { GitService } = require('./git');
const { S3Service } = require('./s3');

const services = {
  git: GitService,
  s3: S3Service
};

exports.createService = (serviceName, params = {}) => ((serviceName in services)
  ? new services[serviceName](params)
  : null);
