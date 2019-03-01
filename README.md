# git-fragments

Git fragments allow creating static website which uses `fragment` tags to pull content from a configured Git repository. It is aimed at creating static websites with content which is splitted into fragments. The fragments are either text of very simple HTML and are managed in a Git. The idea is to empower none technical people to edit website content easily!


## Get Started

Create an HTML file (e.g. index.html) and create the HTML markup. For any content that needs to be loaded from Git use `fragment` tag and provide the `src`.

The `compiler` will then need be configured with the Git repo URL. The `src` should provide the path of the file within the remote Repo. The content files in the Repo should have `.fragment.html` extension. There is no need to add that in the `src`.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Some HTML file</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
  </head>
  <body>
    <div class="hero">
      <div class="hero__inner">
        <div class="hero__title">
          <fragment src="/content/example-page/hero-title"></fragment>
        </div>
        <p class="hero__text">
          <fragment src="/content/example-page/hero-text"></fragment>
        </p>
      </div>
    </div>
      <main id="main" class="container">
      <h1> Welcome to the world of git fragments </h1>
      <div class="page__desc">
        <fragment src="/content/example-page/main-desc"></fragment>
      </div>
      </main>
  </body>
</html>
```

The config can set as `.gitfragmentconfig.js` and it will be used by the compiler.

```js
const path = require('path');

module.exports = {
  srcPath: path.join(__dirname, 'assets-src'),
  targetPath: path.join(__dirname, 'assets-dist'),
  pattern: /html$/,
  git: {
    remote: 'https://github.com/ardeshireshghi/git-fragments.git',
    local: path.join(__dirname, 'tmp')
  },
  fragmentExt: 'fragment.html'
};

```

Above is an example config. Once that is done then by running `bin/git-fragments-compile` it should resolve the `fragment` tags and copy files to `targetPath` as configured.

Below is the output file:

```html
<!DOCTYPE html>
<html>

  <head>
    <title>Some HTML file</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
    </link>
  </head>

  <body>
    <div class="hero">
      <div class="hero__inner">
        <div class="hero__title">
          This is the new title of the hero

        </div>
        <p class="hero__text">
          Some things are better to be done than said

        </p>
      </div>
    </div>
    <main id="main" class="container">
      <h1> Welcome to the world of git fragments </h1>
      <div class="page__desc">
        <p>This is a demo page to show the usage of fragments to create static websites. The idea is to make use of version control and simple html to help none technical people manage content for marketing and other purposes</p>

      </div>
    </main>
  </body>

</html>
```

