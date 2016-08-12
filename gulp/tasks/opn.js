var gulp = require('gulp');
var opn = require('opn');
var config = require('../config').server;

gulp.task('opn', function() {
    var url = "http://" + config.settings.host + ":" + config.settings.port;
    opn(url);
});
