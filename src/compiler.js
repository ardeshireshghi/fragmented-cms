/* eslint no-console: "off" */

const path = require('path');
const git = require('simple-git/promise');
const fs = require('fs');
const pretty = require('pretty');

const { dom } = require('./lib/dom');

const {
  getFileContent,
  safeWriteToFileStream,
  mkdirpAsync,
  rmDirRecursiveAsync,
  getFilesByPattern
} = require('./lib/utils');

const config = require('./lib/config');

async function replaceFileFragmentsWithContent({
  git: gitConfig, fragmentExt, srcPath, targetPath, sourceFilePath, fileBuffer
}) {
  const targetFullPath = `${targetPath}${sourceFilePath.replace(srcPath, '')}`;
  const $ = dom(fileBuffer.toString());

  const readContentAndReplace = (fragmentSrc, fragmentDomEl) => {
    const fragmentLocalPath = `${gitConfig.local}${fragmentSrc}.${fragmentExt}`;

    return new Promise(async (resolve) => {
      const fragmentContent = (await getFileContent(fragmentLocalPath)).toString();
      $(fragmentDomEl).replaceWith(fragmentContent);

      resolve();
    });
  };

  const fragmentsCompileContentPromises = $('fragment')
    .map((_, fragmentEl) => readContentAndReplace($(fragmentEl).attr('src'), fragmentEl));

  await Promise.all(Array.from(fragmentsCompileContentPromises));

  // Create directory in target if it does not exist
  if (!fs.existsSync(path.dirname(targetFullPath))) {
    await mkdirpAsync(path.dirname(targetFullPath));
  }

  safeWriteToFileStream(fs.createWriteStream(targetFullPath), pretty($.html()), () => {
    console.log('Compiled file %s to %s successfully', sourceFilePath, targetFullPath);
  });
}

async function renderFragmentTags(compilerConfig) {
  const { pattern, srcPath } = compilerConfig;

  const filePaths = await getFilesByPattern(srcPath, pattern);
  const fileContents = await Promise.all(filePaths.map(getFileContent));

  fileContents.forEach((fileBuffer, index) => {
    replaceFileFragmentsWithContent({
      ...compilerConfig,
      sourceFilePath: filePaths[index],
      fileBuffer
    });
  });
}

async function cloneGitContentRepo({ remote, local }) {
  await rmDirRecursiveAsync(local);
  await git().silent(true)
    .clone(remote, local)
    .catch(err => console.error('failed: ', err));
}

async function main(compilerConfig) {
  await cloneGitContentRepo(compilerConfig.git);
  await renderFragmentTags(compilerConfig);
}

main(config);
