var base = '.';
var dest = './dist';
var src = './src';
var gutil = require('gulp-util');

module.exports = {
  
  server: {
    settings: {
      root: '.',
      host: gutil.env.host === void 0 ? 'localhost' : gutil.env.host,
      port: 8080,
      livereload: {
        port: 35929
      }
    }
  },
  inject:{
    paths:{
      
    }
  }
}