
/**
 * Module dependencies.
 */

var express = require('express')
  , https = require('https')
  , fs = require('fs')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
var mongoose = require('mongoose');
var session = require('express-session');
var Passports = require('./passports')
var MongoStore = require('connect-mongostore')(session);

mongoose.connect("mongodb://localhost/chatDB", {
	server: {poolSize: 50},
}, function(err) {
	if(err){
	   console.log('Mongo Error ' + err);
	}
	else {
		console.log('MongoDB Connection Established');
	}
});

var sessionMiddleware = session({ 
  secret: 'chat app',
  resave : false, 
  saveUninitialized : false,
  maxAge: new Date(Date.now() + 31536000000),
  store: new MongoStore(
    {
      db: "chatDB",
      autoReconnect: true
    },
    function(collection){
        if (!collection)
          console.log('Error setting up mongo store');
    })
});

app.use(sessionMiddleware);

app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var User = require('./models/user');
var userPassport = Passports(User, 'User');
app.use('/', userPassport.initialize());
app.use('/', userPassport.session());
app.use('/', userPassport.authenticate('remember-me'));

require('./routes/client/chat')(app);
require('./routes/client/chatroom')(app);
require('./routes/login')(app);

const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

var server = https.createServer(options, app);

// WebSocket Setting
var websocket = require('./routes/utils/websocket');
websocket.setConnection(server, sessionMiddleware);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
