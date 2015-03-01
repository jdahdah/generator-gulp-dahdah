'use strict';
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install', {
      desc: 'Skips the installation of dependencies',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! Out of the box I include HTML5 Boilerplate, jQuery and a gulpfile.js to build your app. If you opt to work without Bootstrap, you even get Normalize.css as a free bonus!'));
    }

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Sass instead of Less',
        value: 'includeSass',
        checked: false
      }, {
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: false
      }, {
        name: 'Fastclick',
        value: 'includeFastclick',
        checked: true
      }, {
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      }]
    }, {
      type: 'input',
      name: 'shortname',
      message: 'Project short name?',
      default: this.appname
    }, {
      type: 'input',
      name: 'fullname',
      message: 'Project full name?',
      default: this.appname
    }, {
      type: 'input',
      name: 'author',
      message: 'Author name? (That\'s you!)',
      store: true
    }];

    this.prompt(prompts, function (answers) {
      var features = answers.features;

      var hasFeature = function (feat) {
        return features.indexOf(feat) !== -1;
      };

      // manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.includeSass = hasFeature('includeSass');
      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeModernizr = hasFeature('includeModernizr');
      this.includeFastclick = hasFeature('includeFastclick');

      this.shortname = answers.shortname;
      this.fullname  = answers.fullname;
      this.author    = answers.author;

      done();
    }.bind(this));
  },

  writing: {
    gulpfile: function () {
      this.template('gulpfile.js');
    },

    packageJSON: function () {
      this.template('_package.json', 'package.json');
    },

    git: function () {
      this.copy('gitignore', '.gitignore');
      this.copy('gitattributes', '.gitattributes');
    },

    bower: function () {
      var bower = {
        name: this._.slugify(this.shortname),
        private: true,
        dependencies: {}
      };

      if (this.includeBootstrap) {
        var bs = 'bootstrap' + (this.includeSass ? '-sass-official' : '');
        bower.dependencies[bs] = '~3.3.1';
      } else {
        bower.dependencies.jquery = '~2.1.1';
        bower.dependencies['normalize-css'] = '~3.0.2';
      }

      if (this.includeModernizr) {
        bower.dependencies.modernizr = '~2.8.1';
      }

      if (this.includeFastclick) {
        bower.dependencies['fastclick'] = '~1.0.6';
      }

      this.copy('bowerrc', '.bowerrc');
      this.write('bower.json', JSON.stringify(bower, null, 2));
    },

    jshint: function () {
      this.copy('jshintrc', '.jshintrc');
    },

    editorConfig: function () {
      this.copy('editorconfig', '.editorconfig');
    },

    h5bp: function () {
      this.copy('favicon.ico', 'app/favicon.ico');
      this.copy('robots.txt', 'app/robots.txt');
    },

    mainStylesheet: function () {
      var css = 'main';

      if (this.includeSass) {
        css += '.scss';
      } else {
        css += '.less';
      }

      this.copy(css, 'app/styles/' + css);
    },

    customStylesheets: function () {

      if (this.includeSass) {
        this.copy('styles/fonts.scss',     'app/styles/fonts.scss');
        this.copy('styles/mixins.scss',    'app/styles/mixins.scss');
        this.copy('styles/styles.scss',    'app/styles/styles.scss');
        this.copy('styles/variables.scss', 'app/styles/variables.scss');
      } else {
        this.copy('styles/fonts.less',     'app/styles/fonts.less');
        this.copy('styles/mixins.less',    'app/styles/mixins.less');
        this.copy('styles/styles.less',    'app/styles/styles.less');
        this.copy('styles/variables.less', 'app/styles/variables.less');
      }
    },

    writeIndex: function () {
      this.indexFile = this.src.read('index.html');
      this.indexFile = this.engine(this.indexFile, this);

      // wire Bootstrap plugins
      if (this.includeBootstrap) {
        var bs = '/bower_components/';

        if (this.includeSass) {
          bs += 'bootstrap-sass-official/assets/javascripts/bootstrap/';
        } else {
          bs += 'bootstrap/js/';
        }

        this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
          bs + 'affix.js',
          bs + 'alert.js',
          bs + 'dropdown.js',
          bs + 'tooltip.js',
          bs + 'modal.js',
          bs + 'transition.js',
          bs + 'button.js',
          bs + 'popover.js',
          bs + 'carousel.js',
          bs + 'scrollspy.js',
          bs + 'collapse.js',
          bs + 'tab.js'
        ]);
      }

      this.indexFile = this.appendFiles({
        html: this.indexFile,
        fileType: 'js',
        optimizedPath: 'scripts/main.js',
        sourceFileList: ['scripts/main.js']
      });

      this.write('app/index.html', this.indexFile);
    },

    app: function () {
      this.mkdir('app');
      this.mkdir('app/scripts');
      this.mkdir('app/styles');
      this.mkdir('app/images');
      this.mkdir('app/fonts');
      this.copy('main.js', 'app/scripts/main.js');
    }
  },

  install: function () {
    var howToInstall =
      '\nAfter running ' +
      chalk.yellow.bold('npm install & bower install') +
      ', inject your' +
      '\nfront end dependencies by running ' +
      chalk.yellow.bold('gulp wiredep') +
      '.';

    if (this.options['skip-install']) {
      this.log(howToInstall);
      return;
    }

    this.installDependencies({
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });

    this.on('end', function () {
      var bowerJson = this.dest.readJSON('bower.json');

      // wire Bower packages to .html
      wiredep({
        bowerJson: bowerJson,
        directory: 'bower_components',
        exclude: ['bootstrap/dist', 'bootstrap-sass', 'bootstrap.js'],
        ignorePath: /^(\.\.\/)*\.\./,
        src: 'app/index.html'
      });

      if (this.includeSass) {
        // wire Bower packages to .scss
        wiredep({
          bowerJson: bowerJson,
          directory: 'bower_components',
          ignorePath: /^(\.\.\/)+/,
          src: 'app/styles/*.scss'
        });
      } else {
        // wire Bower packages to .less
        wiredep({
          bowerJson: bowerJson,
          directory: 'bower_components',
          ignorePath: /^(\.\.\/)+/,
          src: 'app/styles/*.less'
        });
      }

      // ideally we should use composeWith, but we're invoking it here
      // because generator-mocha is changing the working directory
      // https://github.com/yeoman/generator-mocha/issues/28
      this.invoke(this.options['test-framework'], {
        options: {
          'skip-message': this.options['skip-install-message'],
          'skip-install': this.options['skip-install']
        }
      });
    }.bind(this));
  }
});
