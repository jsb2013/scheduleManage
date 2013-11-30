
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MemcachedStore = require('connect-memcached')(express);

var app = express();

// all environments
app.configure(function(){
   app.set('port', process.env.PORT || 3000);
   app.set('views', path.join(__dirname, 'views'));
   app.set('view engine', 'ejs');
   app.use(express.cookieParser("hogehoge"));
   app.use(express.session());
   app.use(express.favicon());
   app.use(express.logger('dev'));
   app.use(express.bodyParser());
      app.use(app.router);
   app.use(express.json());
   app.use(express.urlencoded());
   app.use(express.methodOverride());
   app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.display);
app.get('/login', routes.login);
app.post('/login', routes.loginpost);

app.get('/create', routes.create);
app.post('/create', routes.createpost);

//app.get('/users', user.list);
app.get('/display_all', routes.display);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
