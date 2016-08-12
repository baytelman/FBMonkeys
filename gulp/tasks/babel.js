var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

gulp.task('babel', function () {
    return   gulp.src(['./src/**/*.js','./src/**/*.jsx'])
	        .pipe(babel())
	        .pipe(concat('compiled.js'))
	        .pipe(gulp.dest('dist'))
	        .pipe(connect.reload());;
});