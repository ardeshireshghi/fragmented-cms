const pretty = require('pretty');

const { dom } = require('./lib/dom');
const { writeToTargetPath } = require('./lib/writer');
const { GitService } = require('./lib/git');

const {
  getFileContent,
  getFilesByPattern
} = require('./lib/utils');

const config = require('./lib/config');

async function compileFragmentsWithContent({ gitService, fragmentExt, fileBuffer }) {
  const $ = dom(fileBuffer.toString());
  const fragments = Array.from($('fragment'));

  await Promise.all(
    fragments.map(async (el) => {
      const fragmentSrc = $(el).attr('src');
      const fragmentGitPath = `${fragmentSrc}.${fragmentExt}`;
      const fragmentContent = (await gitService.getContent(fragmentGitPath)).toString();
      $(el).replaceWith(fragmentContent);
    })
  );

  return pretty($.html());
}
async function compile({ gitService, compilerConfig }) {
  const { pattern, srcPath, targetPath } = compilerConfig;

  const filePaths = await getFilesByPattern(srcPath, pattern);
  const fileContents = await Promise.all(filePaths.map(getFileContent));

  fileContents.forEach(async (fileBuffer, index) => {
    const sourceFilePath = filePaths[index];
    const compiledFileData = await compileFragmentsWithContent({
      ...compilerConfig,
      fileBuffer,
      gitService
    });

    writeToTargetPath({
      sourceFilePath,
      targetPath,
      srcPath,
      compiledFileData
    });
  });
}

async function main(compilerConfig) {
  const { remote: remoteOrigin, local: localPath } = compilerConfig.git;
  const gitService = GitService({
    remoteOrigin,
    localPath
  });

  await gitService.fetch();
  await compile({
    gitService,
    compilerConfig
  });
}

main(config);
