/* eslint no-console: "off" */
const git = require('simple-git/promise');

const {
  getFileContent,
  rmDirRecursiveAsync
} = require('../utils');

exports.GitService = (() => {
  class Service {
    constructor({ remoteOrigin, localPath }) {
      this._remoteOrigin = remoteOrigin;
      this._localPath = localPath;
    }

    async fetch() {
      await rmDirRecursiveAsync(this._localPath);
      await this._cloneGitContentRepo();
      this._fetchedRepo = true;
    }

    async getContent(fragmentFilePath) {
      return (await getFileContent(`${this._localPath}${fragmentFilePath}`)).toString();
    }

    async _cloneGitContentRepo() {
      await git().silent(true)
        .clone(this._remoteOrigin, this._localPath)
        .catch(err => console.error('failed: ', err));
    }
  }

  return Service;
})();
