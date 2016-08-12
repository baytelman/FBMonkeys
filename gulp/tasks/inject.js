var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var concat = require('gulp-concat');

gulp.task('inject', function () {
  return gulp.src('./index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('.'));
});