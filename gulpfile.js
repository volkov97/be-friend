'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');
var concat   = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var font2css = require('gulp-font2css').default;
var server = require('gulp-develop-server');
var browserSync	= require('browser-sync');

var options = {
    server: {
        path: 'bin/www',
        execArgv: [ '--harmony' ]
    },
    browserSync: {
        proxy: 'http://localhost:3000',
        notify: false
    }
};

gulp.task( 'server:start', function() {
    server.listen( options.server, function( error ) {
        if( ! error ) browserSync( options.browserSync );
    });
});

gulp.task( 'server:restart', function() {
    server.restart( function( error ) {
        if( ! error ) browserSync.reload();
    });
});

var paths = {
    // Styles
    src_sassFiles: './src/scss/main.scss',
    dest_cssFolder: './public/stylesheets',

    // JS
    src_jsFiles: './src/js/**/*.js',
    dest_jsFolder: './public/javascripts',

    // Fonts
    src_fontsFiles: 'src/fonts/**/*.{otf,ttf,woff,woff2}', 

    // SVG
    src_svgFiles: 'src/svg/*.svg',
    dest_svgFolder: './public/images'
}

gulp.task('sass', function () {
    return gulp.src(paths.src_sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            browsers: ['last 20 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(paths.dest_cssFolder))
        .pipe(browserSync.reload({stream: true}))
});
 
gulp.task('sass:watch', function () {
    gulp.watch("./src/scss/**/*.scss", ['sass']);
});

gulp.task('js', function () {
    return gulp.src(paths.src_jsFiles)
        //.pipe(uglify())
        //.pipe(concat("script.js"))
        .pipe(gulp.dest(paths.dest_jsFolder))
});

gulp.task('js:watch', function () {
    gulp.watch(paths.src_jsFiles, ['js']);
});
 
gulp.task('svgstore', function () {
    return gulp
        .src(paths.src_svgFiles)
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest(paths.dest_svgFolder));
});
 
gulp.task('fonts', function() {
    return gulp.src(paths.src_fontsFiles)
        .pipe(font2css())
        .pipe(concat('fonts.css'))
        .pipe(gulp.dest(paths.dest_cssFolder))
})

gulp.task('watch', function () {
    gulp.watch(paths.src_jsFiles, ['js']);
    gulp.watch("./src/scss/**/*.scss", ['sass']);
    gulp.watch('views/**/*.jade');
    gulp.watch('routes/**/*.js');
});

gulp.task('watchWithSync', ['server:start'], function () {
    gulp.watch(paths.src_jsFiles, ['js'], browserSync.reload);
    gulp.watch("./src/scss/**/*.scss", ['sass']);
    gulp.watch('views/**/*.jade', browserSync.reload);
    gulp.watch('routes/**/*.js', ['server:restart']);
});

gulp.task('default', ['watch']);