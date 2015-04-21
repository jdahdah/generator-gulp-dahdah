'use strict';
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var jade = require('jade');
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
      this.log(yosay('\'Allo \'allo! Out of the box I include HTML5 Boilerplate, jQuery, Normalize.css and a gulpfile.js to build your app.'));
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
        name: 'Jade',
        value: 'includeJade',
        checked: false
      }, {
        name: 'Modular Templates (Jade or Nunjucks)',
        value: 'includeModules',
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
      this.includeJade = hasFeature('includeJade');
      this.includeModules = hasFeature('includeModules');
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
        var css = '.scss';
      } else {
        var css = '.less';
      }

      this.copy('styles/fonts'      + css,  'app/styles/fonts'      + css);
      this.copy('styles/mixins'     + css,  'app/styles/mixins'     + css);
      this.copy('styles/styles'     + css,  'app/styles/styles'     + css);
      this.copy('styles/variables'  + css,  'app/styles/variables'  + css);
    },

    writeIndex: function () {

      if (this.includeJade) {
        var html = '.jade';
      } else {
        var html = '.html';
      }

      if (this.includeModules) {
        this.copy('modules/index-modular' + html, 'app/index' + html);
      } else {
        this.copy('index'                 + html, 'app/index' + html);
      }
    },

    app: function () {

      this.mkdir('app');
      this.mkdir('app/scripts');
      this.mkdir('app/styles');
      this.mkdir('app/images');
      this.mkdir('app/fonts');
      this.copy('main.js', 'app/scripts/main.js');

      if (this.includeModules) {
        if (this.includeJade) {
          var html = '.jade';
        } else {
          var html = '.html';
        }
      
        this.copy('modules/include-header' + html, 'app/includes/header' + html);
        this.copy('modules/include-footer' + html, 'app/includes/footer' + html);
        this.copy('modules/layout-default' + html, 'app/layouts/default' + html);
        this.copy('modules/module-example' + html, 'app/modules/example' + html);
      }
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

      if (this.includeJade) {
        var html = 'jade';
      } else {
        var html = 'html';
      }

      wiredep({
        bowerJson: bowerJson,
        directory: 'bower_components',
        exclude: ['bootstrap/dist', 'bootstrap-sass', 'bootstrap.js'],
        ignorePath: /^(\.\.\/)*\.\./,
        src: 'app/**/*.' + html
      });

      // wire Bower packages to .scss/.less

      if (this.includeSass) {
        var css = 'scss';
      } else {
        var css = 'less';
      }

      wiredep({
        bowerJson: bowerJson,
        directory: 'bower_components',
        ignorePath: /^(\.\.\/)+/,
        src: 'app/styles/*.' + css
      });
    

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
