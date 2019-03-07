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
      const fragmentPath = (fragmentBackend !== 'wordpress') ? `${fragmentSrc}.${fragmentExt}` : fragmentSrc;

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
    await Promise.all(
      fileContents.map(async (fileBuffer, index) => {
        const sourceFilePath = filePaths[index];
        try {
          const compiledFileData = await compileFragmentsWithContent({
            ...config,
            fileBuffer,
            serviceManager
          });

          return writeToTargetPath({
            sourceFilePath,
            targetPath,
            srcPath,
            compiledFileData
          });
        } catch (err) {
          console.error(`Error while compiling fragment in file: ${sourceFilePath}`);
          throw err;
        }
      })
    );
  } catch (err) {
    console.error('Error compiling the fragments', err.message);
    if (err.stack) {
      console.error('Below is the trace: \n', err.stack);
    }
    process.exit(1);
  }
}

module.exports = {
  compile
};
