const fetch = require('node-fetch');

class Service {
  constructor({ url }) {
    this._url = url;
  }

  async getContent(contentPath) {
    if (!contentPath.includes('posts') && !contentPath.includes('pages')) {
      throw new Error('Wordpress content type is not supported');
    }

    const res = await fetch(`${this._url}${Service.wordPressRestfulUrlPath}${contentPath}`);

    if (res.ok) {
      const { content: { rendered } } = await res.json();
      return rendered;
    }
    throw new Error(`Error reading wordpress content: ${res.statusText}`);
  }

  static get wordPressRestfulUrlPath() {
    return '/wp-json/wp/v2';
  }
}

exports.WordpressService = Service;
