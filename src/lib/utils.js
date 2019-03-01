const recursive = require('recursive-readdir');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const fs = require('fs');

function getFileContent(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, buffer) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(buffer);
    });
  });
}

function safeWriteToFileStream(stream, data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

function mkdirpAsync(newDir) {
  return new Promise((resolve, reject) => {
    mkdirp(newDir, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function rmDirRecursiveAsync(dirPath) {
  return new Promise((resolve, reject) => {
    rimraf(dirPath, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

async function getFilesByPattern(filePath, pattern) {
  return (await recursive(filePath))
    .filter(file => pattern.test(file));
}

module.exports = {
  getFileContent,
  safeWriteToFileStream,
  mkdirpAsync,
  rmDirRecursiveAsync,
  getFilesByPattern
};
