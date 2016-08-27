
global.rootRequire = function (name) {
  return require(__dirname + '/' + name);
}

var env = process.env.NODE_ENV || 'development'
  , express         = require('express')
  , sassMiddleware  = require('node-sass-middleware')
  , app             = express();

app.set('port', (process.env.PORT || 5000) );
app.set('view engine', 'ejs');

require('express-helpers')(app);

app.use(
  sassMiddleware({
    src: __dirname + '/sass',
    dest: __dirname + '/public/css',
    prefix:  '/css',
    debug: true,
  })
);

// Configuration specific to production env
if (env == 'production') {
  // Force SSL on heroku by checking the 'x-forwarded-proto' header
  var forceSSL = require('express-force-ssl');
  app.set('forceSSLOptions', {trustXFPHeader: true});
  app.use(forceSSL);
}

app.use(express.static(__dirname + '/public'));


var renderIndex = function (req, res) {
  res.render('index', {
    userParam: req.param('user')
  });
}

// Root route
app.route('/')
  .all()
  .get(renderIndex)
  .post(renderIndex);


// Set up the express application server
var server = app.listen( (process.env.PORT || 5000), function () {
  var server_url = server.address()
    , host = server_url.address
    , port = server_url.port || 5000;
  console.log('React City App listening at http://%s:%s', host, port);
});
