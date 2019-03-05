const S3 = require('aws-sdk/clients/s3');

function createS3Client() {
  return new S3({
    apiVersion: '2006-03-01'
  });
}

class Service {
  constructor({ bucketName, client = createS3Client() }) {
    this._bucketName = bucketName;
    this._client = client;
  }

  getContent(s3Key) {
    return this._client.getObject({
      Bucket: this._bucketName,
      Key: s3Key.replace(/^\//, '')
    }).promise().then(res => res.Body.toString());
  }
}

exports.S3Service = Service;
