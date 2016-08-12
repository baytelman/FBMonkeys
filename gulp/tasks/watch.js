var gulp = require('gulp');

gulp.task('watch', function () {
    var watcher = gulp.watch(['./src/**/*.js','./src/**/*.jsx'],['babel']);
    watcher.on("change",function(event){
    	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});