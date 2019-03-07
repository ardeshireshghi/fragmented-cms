# Fragmented CMS

"Fragmented CMS" allows creating static website which uses `fragment` tags to pull content from various data sources. Currently it supports below:

* Git repository
* AWS S3 Bucket
* Wordpress pages and posts

It is aimed at creating static websites with content which is splitted into fragments. The fragments are either text of very simple HTML. The idea is to empower none technical people to edit website content easily using known tools. It is recommanded to use a desktop application for creating and editing S3 files/objects.


## Get Started

Create an HTML file (e.g. index.html) and create the HTML markup. For any content that needs to be loaded from Git use `fragment` tag and provide the `src` and `backend`.

### Examples

For S3 and Git sources the `src` should provide the path of the file in the source (directory in Git and key in S3). The content files in the should have `.fragment.html` extension. There is no need to add that in the `src`.

For wordpress `src` is a reference to `page` or `'post` along with the ID. Below are examples:

#### S3
`<fragment src="/path/to/s3/file" backend="s3"></fragment>`

#### Git
`<fragment src="/path/to/directory-on-git/file" backend="git"></fragment>`

#### Wordpress
`<fragment src="/pages/{page-id}" backend="wordpress"></fragment>`
`<fragment src="/posts/{post-id}" backend="wordpress"></fragment>`

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
          <fragment backend="git" src="/content/example-page/hero-title"></fragment>
        </div>
        <p class="hero__text">
          <fragment backend="git" src="/content/example-page/hero-text"></fragment>
        </p>
      </div>
    </div>
      <main id="main" class="container">
      <h1> Welcome to the world of git fragments </h1>
      <div class="page__desc">
        <fragment backend="git" src="/content/example-page/main-desc"></fragment>
      </div>
      <div class="wordpress-post">
        <h2>This is an example of a Wordpress page embedded</h2>
        <fragment backend="wordpress" src="/pages/107"></fragment>
      </div>
      </main>
      <footer class="footer">
        <div class="container">
          <fragment backend="s3" src="/footer"></fragment>
        </div>
      </footer>
  </body>
</html>
```

## Configuration

The `compiler` will then need be configured with the fragment source.

The config file should be named `.fragment-cms-config.js` and placed in the root folder. It will be used by the compiler.

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
  s3: {
    bucket: 'gitfragment-website-content'
  },
  wordpress: {
    url: 'https://theflair.co.uk'
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
      <div class="wordpress-post">
        <h2>This is an example of a Wordpress page embedded</h2>
        <p><img class="alignnone size-full wp-image-145" src="https://theflair.co.uk/wp-content/uploads/2017/02/IMG_1011.jpg" alt="" width="2304" height="1536" srcset="https://www.theflair.co.uk/wp-content/uploads/2017/02/IMG_1011.jpg 2304w, https://www.theflair.co.uk/wp-content/uploads/2017/02/IMG_1011-300x200.jpg 300w, https://www.theflair.co.uk/wp-content/uploads/2017/02/IMG_1011-768x512.jpg 768w, https://www.theflair.co.uk/wp-content/uploads/2017/02/IMG_1011-1024x683.jpg 1024w" sizes="(max-width: 2304px) 100vw, 2304px" />The flair is my current project that I invest lots of time and energy in it. It is basically about things in life that I have a flair for, like traveling, food and writing. You may say these topics are already very exposed, and ask why do I feel like there is a need to discuss it even more?</p>
        <p>When I moved to London, years ago, I found it very difficult to adjust to the new culture. After a while, I got sick and my illness was a combination of depression and a severe type of IBS. Treatments wouldn&#x2019;t work for me, so I had to go back to my country to see a specialist on a regular basis.</p>
        <p>During the very first session of therapy I had to answer this question: what do you truly like to do? What things do you have a flair for? And my answer was nothing.</p>
        <p>I could not think of one single activity that made me really excited. At that moment, I started my journey, a journey which led into my recovery and health. I learnt there are lots of small things that can make us happy; things that are not necessarily hard to achieve but simply need our attention.</p>
        <p>I discovered how food makes me cheerful, the joy of combining new and old ingredients, and exploring diverse tastes and colors in restaurants that I haven&#x2019;t been to before. I understood traveling makes me content because it gives me the opportunity to discover more, explore more and learn more.</p>
        <p>So finally, I was happy. I still haven&#x2019;t achieved the goals that I set for myself years ago, but I don&#x2019;t feel like a loser anymore. Although I&#x2019;m still trying to achieve my goals and dreams, I decided to enjoy the ride too. And I wanted you to be a part of this ride with me. For those of you who don&#x2019;t feel hopeful or accomplished or confident, I want you to know that you are not alone. All of us, have the flair and the talent, we just need to give ourselves a chance to discover it. I hope this blog gives you the motivation to find and pursue your very own passion.</p>

      </div>
    </main>
    <footer class="footer">
      <div class="container">
        This is the content of the footer

      </div>
    </footer>
  </body>

</html>
```

