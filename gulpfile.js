var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var pump = require('pump');

gulp.task('scripts', function () {
    return gulp.src('./public/javascripts/**/_*.js')
        .pipe(concat('game.js'))
        .pipe(gulp.dest('./public/javascripts/'));
})

gulp.task('compress', function (cb) {
    pump([
        gulp.src(['./public/javascripts/dependencies/createjs/*.js', './public/javascripts/**/_*.js']),
        concat('game.js'),
        uglify({
            mangle: {
                keep_fnames: false,
            },
            toplevel: true,
        }),
        gulp.dest('./public/javascripts/')
    ],
        cb
    );
});

gulp.task('sass', function () {
    return gulp.src('./public/stylesheets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/stylesheets'));
});


gulp.task('watch', function () {
    // Watch partial js files
    gulp.watch("./public/javascripts/**/_*.js", ['compress']);
    gulp.watch("./public/stylesheets/sass/**/*.scss", ['sass']);
})

// default task
gulp.task('default', ['compress', 'sass', 'watch']);