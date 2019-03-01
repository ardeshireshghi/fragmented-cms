/* eslint no-console: "off" */

const fs = require('fs');
const path = require('path');

const {
  safeWriteToFileStream,
  mkdirpAsync
} = require('./utils');

async function writeToTargetPath({
  targetPath, sourceFilePath, srcPath, compiledFileData
}) {
  const targetFileNamePath = `${targetPath}${sourceFilePath.replace(srcPath, '')}`;

  // Create directory in target if it does not exist
  if (!fs.existsSync(path.dirname(targetFileNamePath))) {
    await mkdirpAsync(path.dirname(targetFileNamePath));
  }

  safeWriteToFileStream(fs.createWriteStream(targetFileNamePath), compiledFileData, () => {
    console.log('Compiled file %s to %s successfully', sourceFilePath, targetFileNamePath);
  });
}

exports.writeToTargetPath = writeToTargetPath;
