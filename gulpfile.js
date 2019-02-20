'use strict';

const Fiber = require('fibers');
const {src, parallel, series, dest,} = require('gulp');

const sass = require('gulp-sass');
sass.compiler = require('sass');

const babel = require('gulp-babel');

const mocha = require('gulp-mocha');
const gulpClean = require('gulp-clean');

const css = function ()
{
    return src('./src/static/scss/*.scss')
        .pipe(sass({
            fiber: Fiber,
            outputStyle: 'compressed',
        }).on('error', sass.logError))
        .pipe(dest('dist'));
};

const js = function ()
{
    return src('src/static/js/*.js')
        .pipe(babel({
            presets: [ "minify", "@babel/preset-env", ],
        }))
        .pipe(dest('dist'));
};

const clean = function ()
{
    return src('dist/*', {read: false,})
        .pipe(gulpClean());
};

const test = function ()
{
    return src('test/**/*.js', {read: false,})
        .pipe(mocha({
            reporter: 'spec',
            recursive: true,
            exit: true,
        }))
};

exports.default = series(clean, parallel(css, js), test);
exports.js = js;
exports.css = css;
exports.clean = clean;
exports.test = test;