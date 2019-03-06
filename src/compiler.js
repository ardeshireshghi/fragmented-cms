/* eslint no-console: "off" */

const pretty = require('pretty');

const { dom } = require('./lib/dom');
const { writeToTargetPath } = require('./lib/writer');
const { ServiceProviderManager } = require('./lib/provider-manager');

const {
  getFileContent,
  getFilesByPattern
} = require('./lib/utils');

async function compileFragmentsWithContent({ fragmentExt, fileBuffer, serviceManager }) {
  const $ = dom(fileBuffer.toString());
  const fragments = Array.from($('fragment'));

  await Promise.all(
    fragments.map(async (el) => {
      const fragmentSrc = $(el).attr('src');
      const fragmentBackend = $(el).attr('backend');

      if (!fragmentBackend || !fragmentSrc) {
        throw new Error(`attribute "backend" or "src" not defined on fragment ${$(el).parent().html()}`);
      }

      const service = await serviceManager.getService(fragmentBackend);
      const fragmentPath = `${fragmentSrc}.${fragmentExt}`;

      const fragmentContent = (await service.getContent(fragmentPath)).toString();
      $(el).replaceWith(fragmentContent);
    })
  );

  return pretty($.html());
}

async function compile(config) {
  const { pattern, srcPath, targetPath } = config;
  const serviceManager = ServiceProviderManager(config);

  const filePaths = await getFilesByPattern(srcPath, pattern);
  const fileContents = await Promise.all(filePaths.map(getFileContent));

  try {
    fileContents.forEach(async (fileBuffer, index) => {
      const sourceFilePath = filePaths[index];
      let compiledFileData;

      try {
        compiledFileData = await compileFragmentsWithContent({
          ...config,
          fileBuffer,
          serviceManager
        });
      } catch(err) {
        throw err;
      }

      writeToTargetPath({
        sourceFilePath,
        targetPath,
        srcPath,
        compiledFileData
      });
    });
  } catch (err) {
    console.log(err.trace(), err.message);
    process.exit(1);
  }
}

module.exports = {
  compile
};
