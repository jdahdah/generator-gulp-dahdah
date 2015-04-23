# Dahdah Design web app generator [![Build Status](https://secure.travis-ci.org/jdahdah/generator-gulp-dahdah.svg?branch=master)](http://travis-ci.org/jdahdah/generator-gulp-dahdah)

> [Yeoman](http://yeoman.io) generator that scaffolds out a front-end web app using [gulp](http://gulpjs.com/) for the build process

This is a strongly modified fork of the original [yeoman/generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp) that includes some nice extra features. It's a work-in-progress and not quite ready for production use, but feel free to play around with it and provide [feedback](https://github.com/jdahdah/generator-gulp-dahdah/issues). Brought to you by [Dahdah Design](http://dahdah.de/en/).

![](screenshot.png)


## Features

Please see our [gulpfile.js](app/templates/gulpfile.js) for up to date information on what we support.

Features exclusive to this modified version are shown **in bold**.

* **CSS-Preprocessing with Less or Sass**
* **Optional: Use Jade instead of plain HTML**
* **Optional: Modular template system for DRY-friendly HTML with example uses (native Jade or HTML with [Nunjucks](http://mozilla.github.io/nunjucks/))**
* **Optional: Automatically include useful extras like [normalize.css](https://github.com/necolas/normalize.css/), [Fastclick](https://github.com/ftlabs/fastclick) and [Modernizr](http://modernizr.com)**
* **Built-in support for the Jade Markdown filter**
* CSS Autoprefixing
* Built-in preview server with BrowserSync
* Automagically compile Sass with [libsass](http://libsass.org)
* Automagically lint your scripts
* Map compiled CSS to source stylesheets with source maps
* Awesome image optimization
* Automagically wire-up dependencies installed with [Bower](http://bower.io)

*For more information on what this generator can do for you, take a look at the [gulp plugins](app/templates/_package.json) used in our `package.json`.*


## libsass

Keep in mind that libsass is feature-wise not fully compatible with Ruby Sass. Check out [this](http://sass-compatibility.github.io) curated list of incompatibilities to find out which features are missing.

If your favorite feature is missing and you really need Ruby Sass, you can always switch to [gulp-ruby-sass](https://github.com/sindresorhus/gulp-ruby-sass) and update the `styles` task in `gulpfile.js` accordingly.


## Getting Started

- Install dependencies: `npm install --global yo bower`
- Install the generator: `npm install --global https://github.com/jdahdah/generator-gulp-dahdah`
- Run `yo gulp-dahdah` to scaffold your webapp
- Run `gulp serve` to preview and watch for changes
- Run `bower install --save <package>` to install frontend dependencies
- Run `gulp` to build your webapp for production


## Docs

* [getting started](docs/README.md) with this generator
* [recipes](docs/recipes/README.md) for integrating other popular technologies like CoffeeScript
* [details](docs/bower.md) about our Bower setup


## Options

- `--skip-welcome-message`
  Skips Yeoman's greeting before displaying options.
- `--skip-install-message`
  Skips the the message displayed after scaffolding has finished and before the dependencies are being installed.
- `--skip-install`
  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.
- `--test-framework=<framework>`
  Defaults to `mocha`. Can be switched for another supported testing framework like `jasmine`.


## Contribute

See the [contributing docs](contributing.md).


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
