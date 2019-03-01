/* eslint no-console: "off" */
const git = require('simple-git/promise');

const {
  getFileContent,
  rmDirRecursiveAsync
} = require('./utils');

exports.GitService = (() => {
  function Service({ remoteOrigin, localPath }) {
    async function cloneGitContentRepo() {
      await git().silent(true)
        .clone(remoteOrigin, localPath)
        .catch(err => console.error('failed: ', err));
    }

    async function fetch() {
      await rmDirRecursiveAsync(localPath);
      await cloneGitContentRepo();
    }

    async function getContent(fragmentFilePath) {
      await getFileContent(`${localPath}${fragmentFilePath}`);
    }

    return {
      fetch,
      getContent
    };
  }

  return Service;
})();
