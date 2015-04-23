/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Gulp webapp generator: styles feature', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'styles'), function (err) {
      if (err) {
        done(err);
        return;
      }

      this.webapp = helpers.createGenerator('gulp-dahdah:app', [
        '../../app', [
          helpers.createDummyGenerator(),
          'mocha:app'
        ]
      ]);
      this.webapp.options['skip-install'] = true;

      done();
    }.bind(this));
  });

  var assertFileExists = function (app, fileExt, features, done) {
    var expected = [
      'app/styles/main.' + fileExt
    ];

    helpers.mockPrompt(app, {
      features: features
    });

    app.run(function () {
      helpers.assertFile(expected);
      done();
    });
  };

  it('should create scss file', function (done) {
    assertFileExists(this.webapp, 'scss', ['includeSass'], done);
  });

  it('should create less file', function (done) {
    assertFileExists(this.webapp, 'less', [], done);
  });
});