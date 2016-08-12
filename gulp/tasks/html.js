var gulp = require('gulp');
var connect = require('gulp-connect');
var watch = require('gulp-watch');

gulp.task('html', function() {
    gulp.src('*.html')
    .pipe(connect.reload());
});
