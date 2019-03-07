const path = require('path');

module.exports = {
  srcPath: path.join(__dirname, 'assets-src'),
  targetPath: path.join(__dirname, 'assets-dist'),
  pattern: /html$/,
  git: {
    remote: 'https://github.com/ardeshireshghi/git-fragments.git',
    local: path.join(__dirname, 'tmp')
  },
  s3: {
    bucket: 'gitfragment-website-content'
  },
  wordpress: {
    url: 'https://www.theflair.co.uk'
  },
  fragmentExt: 'fragment.html'
};
