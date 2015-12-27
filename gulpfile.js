'use strict';

var gulp = require('gulp'),
  jade = require('jade'), // Jade [npm install --save jade]
  gulpJade = require('gulp-jade'), // jade gulp [npm install --save-dev gulp-jade]
  rename = require('gulp-rename'), // rename files -- .pipe(rename('all.min.css')) [npm install --save-dev gulp-rename]
  notify = require('gulp-notify'), // event notification -- .pipe(notify('Minification css finished!')) [npm install --save-dev gulp-notify]
  plumber = require('gulp-plumber'), // tracking error -- .pipe(plumber()) [npm install --save-dev gulp-plumber]
  compass = require('gulp-compass'), // compass + sass -- style: nested, expanded, compact, compressed [npm install --save-dev gulp-compass] [gem update --system] [gem install compass]
  sourcemaps = require('gulp-sourcemaps'), // Source map [npm install --save-dev gulp-sourcemaps]
  htmlhint = require('gulp-htmlhint'),// Validate .html [npm install --save-dev gulp-htmlhint]
  scsslint = require('gulp-scss-lint'), // Validate .scss files with scss-lint [npm install --save-dev gulp-scss-lint] [gem install scss_lint]
  scsslintStylish = require('gulp-scss-lint-stylish2'), // Stylish reporter for gulp-scss-lint [npm install --save-dev gulp-scss-lint-stylish2]
  concat = require('gulp-concat'), // concat css, js files -- .pipe(concat('all.css-js')) [npm install --save-dev gulp-concat]
  autoprefixer = require('gulp-autoprefixer'), // add vendor prefix -webkit, -moz, -ms, -o [npm install --save-dev gulp-autoprefixer]
  connect = require('gulp-connect'), // run a webserver (with LiveReload) [npm install --save-dev gulp-connect]
  livereload = require('gulp-livereload'), // livereload [npm install --save-dev gulp-livereload]
  jshint = require('gulp-jshint'),// validate js. Reporter: default, checkstyle, jslint_xml, non_error, unix; [npm install --save-dev jshint gulp-jshint]
  stylish = require('jshint-stylish'), // Stylish reporter for JSHint (jshint-stylish) [npm install --save-dev jshint-stylish]
  uglify = require('gulp-uglify'), // min js [npm install --save-dev gulp-uglify]
  minifyCss = require('gulp-minify-css'), // min css [npm install --save-dev gulp-minify-css]
  mainBowerFiles = require('main-bower-files'),
  reporter = scsslintStylish({errorsOnly: false}),
  bowerSettings = {
    debugging: false,
    paths: {
      bowerDirectory: 'bower_components',
      bowerrc: '.bowerrc',
      bowerJson: 'bower.json'
    },
    checkExistence: true,
    includeDev: true
  };

gulp.task('connect', function () {
  connect.server({
    root: '',
    port: '8080',
    host: 'localhost',
    livereload: true,
    debug: false
  });
});

gulp.task('libsBower', function () {
  return gulp.src(mainBowerFiles(bowerSettings))
    .pipe(gulp.dest('libs/'));
});

gulp.task('jade', function () {
  return gulp.src('jade/*.jade')
    .pipe(plumber())
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .pipe(notify('Compiling jade in html is successfully completed!'))
    .pipe(gulp.dest('./'))
    .pipe(connect.reload());
});

gulp.task('compass', function () {
  gulp.src('sass/**/*.scss')
    .pipe(plumber())
    .pipe(scsslint({
      config: 'sass/lint.yml',
      customReport: reporter.issues
    }))
    .pipe(compass({
      style: 'expanded',
      css: 'css',
      sass: 'sass',
      javascript: 'js',
      font: 'fonts',
      image: 'img',
      logging: true,
      time: true,
      relative: true,
      comments: false,
      sourcemap: true,
      debug: false
    }))
    .pipe(notify('Compiling sass in css is successfully completed!'))
    .pipe(gulp.dest('css/'))
    //.pipe(reporter.printSummary)
    .pipe(connect.reload());
});

gulp.task('css', function () {
  return gulp.src(['css/main.css'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: [
        'Explorer >= 6',
        'Edge >= 12',
        'Firefox >= 2',
        'Chrome >= 4',
        'Safari >= 3.1',
        'Opera >= 10.1',
        'iOS >= 3.2',
        'OperaMini >= 8',
        'Android >= 2.1',
        'BlackBerry >= 7',
        'OperaMobile >= 12',
        'ChromeAndroid >= 47',
        'FirefoxAndroid >= 42',
        'ExplorerMobile >= 10'
      ],
      cascade: false,
      add: false,
      remove: false
    }))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename({
      basename: "main",
      prefix: "",
      suffix: ".min",
      extname: ".css"
    }))
    .pipe(notify('Minify css completed successfully!'))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('css/'))
    .pipe(connect.reload());
});

gulp.task('js', function () {
  return gulp.src('js/common.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(jshint({
      lookup: true,
      linter: 'jshint'
    }))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(uglify())
    .pipe(rename({
      basename: "common",
      prefix: "",
      suffix: ".min",
      extname: ".js"
    }))
    .pipe(sourcemaps.write('/'))
    .pipe(notify({
      title: '',
      message: 'Minify js completed successfully!',
      sound: false,
      emitError: true,
      onLast: true,
      logLevel: 2
    }))
    .pipe(gulp.dest('js/'))
    .pipe(connect.reload());
});

gulp.task('html-hint', function () {
  gulp.src('*.html')
    .pipe(plumber())
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(notify('Checking html file is successfully completed!'))
    .pipe(htmlhint.reporter())
    //.pipe(htmlhint.failReporter({ supress: true }));
    .pipe(connect.reload());
});

gulp.task('scss-lint', function () {
  return gulp.src('sass/**/*.scss')
    .pipe(plumber())
    .pipe(scsslint({
      config: 'sass/lint.yml',
      customReport: reporter.issues
    }))
    .pipe(reporter.printSummary);
});

gulp.task('js-hint', function () {
  return gulp.src('js/*.js')
    .pipe(plumber())
    .pipe(jshint({
      lookup: true,
      linter: 'jshint'
    }))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jade-watch', ['jade'], function () {
  gulp.watch('jade/*.jade', ['jade']);
});

gulp.task('compass-watch', ['compass'], function () {
  gulp.watch('sass/**/*.scss', ['compass']);
});

gulp.task('watch', ['connect', 'jade', 'html-hint', 'compass', 'js'], function () {
  gulp.watch('jade/*.jade', ['jade']);
  gulp.watch('*.html', ['html-hint']);
  gulp.watch('sass/**/*.scss', ['compass']);
  gulp.watch('css/main.css', ['css']);
  gulp.watch('js/common.js', ['js']);
});

gulp.task('default', ['watch'], function () {});