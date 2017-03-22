// generated on <%= date %> using <%= name %> <%= version %>
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var dev = true;

gulp.task('styles', () => {<% if (includeSass) { %>
  return gulp.src('app/styles/main.scss')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))<% } else { %>
  return gulp.src('app/styles/*.css')
    .pipe($.if(dev, $.sourcemaps.init()))<% } %>
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 3 versions', 'Firefox ESR', 'iOS 7','IE 9']}))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

<% if (includeBabel) { -%>
gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(dev, $.sourcemaps.write('.')))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});
<% } -%>

function lint(files) {
  return gulp.src(files)
    .pipe($.eslint({ fix: true }))
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js')
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js')
    .pipe(gulp.dest('test/spec'));
});

<% if (includePug) { -%>
gulp.task('views', () => {
  return gulp.src('app/*.pug')
    .pipe($.plumber())
    .pipe($.pug({pretty: true, basedir: 'app/'}))
    .pipe(gulp.dest('.tmp'))
    .pipe(reload({stream: true}));
});
<% } -%>

<% if (includeBabel) { -%>
gulp.task('html', [<% if (includePug) { %>'views', <% } %>'styles', 'scripts'], () => {
<% } else { -%>
gulp.task('html', [<% if (includePug) { %>'views', <% } %>'styles'], () => {
<% } -%>
  return gulp.src(['app/*.html'<% if (includePug) { %>, '.tmp/*.html'<% } %>])
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/*.html'<% if (includePug) { %>,
    '!app/*.pug'<% } %>
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});
<% if (includeUncss) { %>
gulp.task('uncss', ['html'], () => {
  // list your selectors here if UnCSS should ignore them:
  var ignoreCSS = [
    /\.active/,         // bootstrap
    /\.alert/,          // bootstrap
    /\.btn/,            // bootstrap
    /\.carousel/,       // bootstrap
    /\.collapse/,       // bootstrap
    /\.collapsing/,     // bootstrap
    /\.fade/,           // bootstrap
    /\.form/,           // bootstrap
    /\.input/,          // bootstrap
    /\.nav/,            // bootstrap
    /\.open/,           // bootstrap
    /\.visible/,        // bootstrap
    /\.hidden/,         // bootstrap
    /\.disabled/,       // bootstrap
    /\.col/,            // bootstrap
    /\.text-/,          // bootstrap
    /\:active/,         // states
    /\:after/,          // states
    /\:before/,         // states
    /\:focus/,          // states
    /\:hover/,          // states
    /\:visited/,        // states
    /\.no-touch/,       // modernizr
    /\.touch/,          // modernizr
    /\.video-js/,       // video.js
    /\.video/,          // video.js
    /\.vjs/,            // video.js
    /\.slick/,          // slick-carousel.js
  ];
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
  return gulp.src('dist/styles/main.css')
  .pipe($.uncss({
    html: ['dist/*.html'],
    ignore: ignoreCSS
  }))
  .pipe($.cssnano({safe: true, autoprefixer: false}))
  .pipe(gulp.dest('dist/styles'));
});
<% } %>
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], [<% if (includePug) { %>'views', <% } %>'styles'<% if (includeBabel) { %>, 'scripts'<% } %>, 'fonts'], () => {
    browserSync.init({
      notify: false,
      open: false,
      port: 9000,
      server: {
        baseDir: ['.tmp', 'app'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch([
      'app/*.html',
<% if (!includeBabel) { -%>
      'app/scripts/**/*.js',
<% } -%>
      'app/images/**/*',
      '.tmp/fonts/**/*'
    ]).on('change', reload);

<% if (includePug) { -%>
    gulp.watch('app/**/*.pug', ['views']);
<% } -%>
    gulp.watch('app/styles/**/*.<%= includeSass ? 'scss' : 'css' %>', ['styles']);
<% if (includeBabel) { -%>
    gulp.watch('app/scripts/**/*.js', ['scripts']);
<% } -%>
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});

gulp.task('serve:dist', ['default'], () => {
  browserSync.init({
    notify: false,
    open: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

<% if (includeBabel) { -%>
gulp.task('serve:test', ['scripts'], () => {
<% } else { -%>
gulp.task('serve:test', () => {
<% } -%>
  browserSync.init({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
<% if (includeBabel) { -%>
        '/scripts': '.tmp/scripts',
<% } else { -%>
        '/scripts': 'app/scripts',
<% } -%>
        '/bower_components': 'bower_components'
      }
    }
  });

<% if (includeBabel) { -%>
  gulp.watch('app/scripts/**/*.js', ['scripts']);
<% } -%>
  gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {<% if (includeSass) { %>
  gulp.src('app/styles/*.scss')
    .pipe($.filter(file => file.stat && file.stat.size))
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));
<% } %>
  gulp.src(<% if (includePug) { %>'app/**/*.pug'<% } else { %>'app/*.html'<% } %>)
    .pipe(wiredep({<% if (includeBootstrap) { if (includeSass) { %>
      exclude: ['bootstrap<% if (legacyBootstrap) { %>-sass<% } %>','modernizr'],<% } else { %>
      exclude: ['bootstrap.js', 'modernizr'],<% }} else { %>
      exclude: [<% if (includeSass) { %>'normalize.css', <% } %>'modernizr'],<%} %>
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'<% if (includeUncss) { %>, 'uncss'<% } %>], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['clean', 'wiredep'], 'build', resolve);
  });
});
