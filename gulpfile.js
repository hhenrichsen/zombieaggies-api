'use strict';

const {src, parallel, series, dest, watch: gulpWatch, } = require('gulp');

const sass = require('gulp-sass');
sass.compiler = require('sass');


const mocha = require('gulp-mocha');
const gulpClean = require('gulp-clean');
const minify = require('gulp-minify');

const postcss      = require('gulp-postcss');
const sourcemaps   = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');
const gzip         = require('gulp-gzip')

const gz_leave_src = function () {

}

const css = function ()
{
    return src('static/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
        }).on('error', sass.logError))
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe(sourcemaps.write('dist/maps'))
        .pipe(dest('dist'));
};

const cssgz = function() {
    return src('static/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
        }).on('error', sass.logError))
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe(gzip())
        .pipe(dest('dist'));
}

const js = function ()
{
    return src('static/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(minify({
            ext: {
                src: '-src.js',
                min: '.js',
            },
        }))
        .pipe(sourcemaps.write('dist/maps'))
        .pipe(dest('dist'));
};

const jsgz = function () {
    return src('static/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(minify({
            ext: {
                src: '-src.js',
                min: '.js',
            },
        }))
        .pipe(sourcemaps.write('dist/maps'))
        .pipe(gzip())
        .pipe(dest('dist'));
}

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

const copy = function ()
{
    return src('./static/copy/*')
        .pipe(dest('./dist/'));
};

const copygz = function () {
    return src('./static/copy/*')
        .pipe(gzip())
        .pipe(dest('./dist'));
}


const build = async function (cb)
{
    await series(clean, parallel(css, cssgz, js, jsgz, copy, copygz))();
    return cb();
};

const watch = function ()
{
    series(clean, parallel(css, js, copy));
    gulpWatch([ 'static/**/*', ], {}, series(clean, parallel(js, css, copy)));
};

exports.default = build;
exports.build = build;
exports.watch = watch;
exports.js = js;
exports.css = css;
exports.clean = clean;
exports.test = test;