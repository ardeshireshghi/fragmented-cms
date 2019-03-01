const cheerio = require('cheerio');

exports.dom = function createDOMParser(html) {
  return cheerio.load(html, {
    decodeEntities: true,
    xmlMode: true
  });
};
