'use strict';

const {src, parallel, series, dest, watch: gulpWatch, } = require('gulp');

const sass = require('gulp-sass');
sass.compiler = require('sass');


const mocha = require('gulp-mocha');
const gulpClean = require('gulp-clean');
const minify = require('gulp-minify');

const css = function ()
{
    return src('./src/static/scss/*.scss')
        .pipe(sass({
            outputStyle: 'compressed',
        }).on('error', sass.logError))
        .pipe(dest('dist'));
};

const js = function ()
{
    return src('src/static/js/*.js')
        .pipe(minify({
            ext: {
                src: '-src.js',
                min: '.js',
            },
        }))
        .pipe(dest('dist'));
};

const clean = function ()
{
    return src('dist/*', {read: false, })
        .pipe(gulpClean());
};

const test = function ()
{
    return src('test/**/*.js', {read: false, })
        .pipe(mocha({
            reporter: 'spec',
            recursive: true,
            exit: true,
        }))
};

const build = function (cb)
{
    series(clean, parallel(css, js));
    cb();
};

const watch = function ()
{
    gulpWatch([ 'src/static/**/*', ], {}, series(clean, parallel(js, css)));
};

exports.default = build;
exports.build = build;
exports.watch = watch;
exports.js = js;
exports.css = css;
exports.clean = clean;
exports.test = test;