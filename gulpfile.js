const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');

gulp.task('sass', function () {
    gulp.src('scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css/'));
});

gulp.task('watch', function () {
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('js/**/*.*', ['browserify']);
});

gulp.task('browserify', () => {
    const bundler = browserify({ entries: 'js/app.js' })
        .transform('babelify', { presets: ['es2015', 'react'] });

    return bundler.bundle().on('error', function (error) {
        console.error(error.message);
        console.error(error.codeFrame);
        this.emit('end');
    })
    .pipe(source('Browser/Browser.js'))
    .pipe(buffer())
    .pipe(rename({ dirname: '', basename: 'bundle' }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['browserify', 'sass', 'watch']);
