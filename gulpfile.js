var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
gulp.task('minify', function() {
    return gulp.src(['js/utility.js','js/configuration.js','js/app/*.js'])
        .pipe(concat('js/games.js'))
        .pipe(gulp.dest('js'))
        .pipe(rename('game.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('js'));
});
gulp.task('default',['scripts']);

