'use strict';

var _gulp = require('gulp');
var _plumber = require('gulp-plumber');
var _sass = require('gulp-sass');
var _cssnano = require('gulp-cssnano');
var _browser = require('browser-sync');
var _amphtml = require('gulp-amphtml-validator');
var _autoprefixer = require('gulp-autoprefixer');
var _panini = require('panini');
var _rimraf = require('rimraf');

_gulp.task('build', _gulp.series(clean, sass, html, validate, assets));
_gulp.task('default', _gulp.series('build', serve, watch));
_gulp.task('publish', _gulp.series('build', github));


var PATHS = {
  dist: 'dist',
  github: 'docs',
  assets: [
    'src/assets/**/*',
    '!src/assets/scss/**/*'
  ]
};

function clean(done) {
  _rimraf(PATHS.dist, done);
}

function assets() {
  return _gulp.src(PATHS.assets)
    .pipe(_gulp.dest(PATHS.dist + '/assets'))
}

function github() {
  return _gulp.src([PATHS.dist + '/**/*'])
    .pipe(_gulp.dest(PATHS.github))
}

function sass() {
  return _gulp.src('src/assets/scss/*.scss')
    .pipe(_plumber())
    .pipe(_sass().on('error', _sass.logError))
    .pipe(_autoprefixer())
    .pipe(_cssnano())
    .pipe(_gulp.dest(PATHS.dist + '/assets/css'));
}

function html() {
  return _gulp.src('src/pages/**/*.html')
    .pipe(_panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      partials: 'src/partials/',
      helpers: 'src/helpers/',
      data: 'src/data/'
    }))
    .pipe(_gulp.dest(PATHS.dist));
}

function validate() {
  return _gulp.src(PATHS.dist + '/*.html')
    .pipe(_amphtml.validate())
    .pipe(_amphtml.format())
    .pipe(_amphtml.failAfterError().on('error', console.log));
}

function serve(done) {
  _browser.init({
    port: 8000,
    open: true,
    ghostMode: false,
    server: {
      baseDir: PATHS.dist
    }
  });
  done();
}

// Reload the browser with BrowserSync
function reload(done) {
  _browser.reload();
  done();
}

function resetPages(done) {
  _panini.refresh();
  done();
}

_gulp.task('refresh', _gulp.series(resetPages, html, validate, reload));

function watch() {
  _gulp.watch('src/assets/scss/**').on('all', _gulp.series(sass, 'refresh'));
  _gulp.watch('src/{pages,partials,layouts,helpers,data}/**/*.{html,js,json}').on('all', _gulp.series('refresh'));
  _gulp.watch(PATHS.assets).on('all', _gulp.series(assets, reload));
}
