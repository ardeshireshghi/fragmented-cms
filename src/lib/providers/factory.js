const { GitService } = require('./git');
const { S3Service } = require('./s3');
const { WordpressService } = require('./wordpress');

const services = {
  git: GitService,
  s3: S3Service,
  wordpress: WordpressService
};

exports.createService = (serviceName, params = {}) => ((serviceName in services)
  ? new services[serviceName](params)
  : null);
