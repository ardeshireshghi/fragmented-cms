/* eslint no-console: "off" */

const pretty = require('pretty');

const { dom } = require('./lib/dom');
const { writeToTargetPath } = require('./lib/writer');
const { ServiceProviderManager } = require('./lib/provider-manager');

const {
  getFileContent,
  getFilesByPattern
} = require('./lib/utils');

const config = require('../.gitfragmentconfig');

const serviceManager = ServiceProviderManager(config);

async function compileFragmentsWithContent({ fragmentExt, fileBuffer }) {
  const $ = dom(fileBuffer.toString());
  const fragments = Array.from($('fragment'));

  await Promise.all(
    fragments.map(async (el) => {
      const fragmentSrc = $(el).attr('src');
      const fragmentBackend = $(el).attr('backend');

      if (!fragmentBackend) {
        throw new Error('Backend attribute is not defined on', el);
      }

      const service = await serviceManager.getService(fragmentBackend);
      const fragmentPath = `${fragmentSrc}.${fragmentExt}`;

      const fragmentContent = (await service.getContent(fragmentPath)).toString();
      $(el).replaceWith(fragmentContent);
    })
  );

  return pretty($.html());
}

async function compile({ compilerConfig }) {
  const { pattern, srcPath, targetPath } = compilerConfig;

  const filePaths = await getFilesByPattern(srcPath, pattern);
  const fileContents = await Promise.all(filePaths.map(getFileContent));

  fileContents.forEach(async (fileBuffer, index) => {
    const sourceFilePath = filePaths[index];
    const compiledFileData = await compileFragmentsWithContent({
      ...compilerConfig,
      fileBuffer
    });

    writeToTargetPath({
      sourceFilePath,
      targetPath,
      srcPath,
      compiledFileData
    });
  });
}

async function startCompile(compilerConfig) {
  try {
    await compile({
      compilerConfig
    });
  } catch (err) {
    console.log(err.trace(), err.message);
  }
}

module.exports = {
  compile() {
    startCompile(config);
  }
};
