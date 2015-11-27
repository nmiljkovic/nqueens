'use strict';

var gulp = require('gulp');
var debug = require('gulp-debug');
var autoprefixer = require('gulp-autoprefixer');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var webserver = require('gulp-webserver');
var systemjsModuleName = require('gulp-systemjs-module-name-injector');
var merge = require('merge-stream');
var del = require('del');

var config = {
    distDir: 'dist',
    tmpDir: 'tmp'
};

var tsProject = typescript.createProject({
    target: 'ES5',
    module: 'system',
    noImplicitAny: true,
    moduleResolution: 'node',
    emitDecoratorMetadata: true,
    experimentalDecorators: true
});

function scriptTag(scripts) {
    return scripts.map((s) => '<script src="' + s + '"></script>')
        .join("\n");
}

function styleTag(styles) {
    return styles.map((s) => '<link rel="stylesheet" href="' + s + '">')
        .join("\n");
}

function cleanProject() {
    return del([config.distDir, config.tmpDir]);
}

function buildCss() {
    return gulp.src('src/styles/application.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(revReplace({manifest: gulp.src(config.tmpDir + '/rev-static.json')}))
        .pipe(rev())
        .pipe(gulp.dest(config.distDir + '/css'))
        .pipe(rev.manifest("rev-css.json"))
        .pipe(gulp.dest(config.tmpDir));
}

function buildJsVendors() {
    return gulp.src([
        'bower_components/lodash/lodash.min.js',
        'bower_components/system.js/dist/system.js',
        'node_modules/angular2/bundles/angular2.min.js',
        'node_modules/angular2/bundles/router.js',
        'node_modules/angular2/bundles/http.min.js',
    ])
        .pipe(concat('vendor.js'))
        .pipe(rev())
        .pipe(gulp.dest(config.distDir + '/js'))
        .pipe(rev.manifest("rev-js-vendors.json"))
        .pipe(gulp.dest(config.tmpDir));
}

function buildTypescript() {
    return gulp.src(['typings/tsd.d.ts', 'src/scripts/**/*.ts'])
        .pipe(typescript(tsProject))
        .pipe(systemjsModuleName())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(config.distDir + '/js'))
        .pipe(rev.manifest("rev-js.json"))
        .pipe(gulp.dest(config.tmpDir));
}

function buildHtml() {
    var scripts = {
        vendor: ['js/vendor.js'],
        app: ['js/app.js']
    };

    var styles = {
        app: ['css/application.css']
    };

    return gulp.src('src/templates/index.html')
        .pipe(replace('<!-- js/vendor -->', scriptTag(scripts.vendor)))
        .pipe(replace('<!-- js/app -->', scriptTag(scripts.app)))
        .pipe(replace('<!-- css/app -->', styleTag(styles.app)))
        .pipe(revReplace({manifest: gulp.src(config.tmpDir + "/rev-js-vendors.json")}))
        .pipe(revReplace({manifest: gulp.src(config.tmpDir + "/rev-js.json")}))
        .pipe(revReplace({manifest: gulp.src(config.tmpDir + "/rev-css.json")}))
        .pipe(gulp.dest(config.distDir));
}

function copyStatic() {
    return  gulp.src('src/images/**/*', {base: 'src'})
        .pipe(rev())
        .pipe(gulp.dest(config.distDir))
        .pipe(rev.manifest("rev-static.json"))
        .pipe(gulp.dest(config.tmpDir));
}

function buildCssDev() {
    return gulp.src('src/styles/application.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(config.distDir + '/css'));
}

function buildTypescriptDev() {
    return gulp.src(['typings/tsd.d.ts', 'src/scripts/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject))
        .pipe(systemjsModuleName())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.distDir + '/js'));
}

function buildHtmlDev() {
    var scripts = {
        vendor: [
            'vendor/js/lodash.js',
            'vendor/js/system.src.js',
            'vendor/js/angular2.dev.js',
            'vendor/js/router.dev.js',
            'vendor/js/http.dev.js'
        ],
        app: ['js/app.js']
    };

    var styles = {
        app: ['css/application.css']
    };

    return gulp.src('src/templates/index.html')
        .pipe(replace('<!-- js/vendor -->', scriptTag(scripts.vendor)))
        .pipe(replace('<!-- js/app -->', scriptTag(scripts.app)))
        .pipe(replace('<!-- css/app -->', styleTag(styles.app)))
        .pipe(gulp.dest(config.distDir));
}

function copyStaticDev() {
    var images = gulp.src('src/images/**/*', {base: 'src'})
        .pipe(gulp.dest(config.distDir));
    var vendorJs = gulp.src([
            'bower_components/system.js/dist/system.src.js',
            'bower_components/lodash/lodash.js',
            'node_modules/angular2/bundles/angular2.dev.js',
            'node_modules/angular2/bundles/router.dev.js',
            'node_modules/angular2/bundles/http.dev.js'
        ])
        .pipe(gulp.dest(config.distDir + '/vendor/js'));

    return merge(images, vendorJs);
}

function watchProject() {
    gulp.watch('src/styles/**/*.scss', gulp.series(buildCssDev));
    gulp.watch('src/scripts/**/*.ts', gulp.series(buildTypescriptDev));
    gulp.watch('src/templates/**/*', gulp.series(copyStaticDev));
}

function runServer() {
    return gulp.src('dist')
        .pipe(webserver({
            host: '0.0.0.0',
            livereload: true
        }));
}

gulp.task('default',
    gulp.series(
        cleanProject,
        gulp.parallel(
            buildCssDev,
            buildTypescriptDev,
            buildHtmlDev,
            copyStaticDev
        ),
        gulp.parallel(
            watchProject,
            runServer
        )
    )
);

gulp.task('build',
    gulp.series(
        cleanProject,
        gulp.parallel(
            gulp.series(copyStatic, buildCss),
            buildJsVendors,
            buildTypescript
        ),
        buildHtml
    )
);
