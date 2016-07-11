// Require the dependencies
var express = require('express'),
	exphbs = require('express-handlebars'),
	http = require('http'),
	mongoose = require('mongoose'),
	routes = require('./routes'),
	config = require('./config'),
	twitter = require('ntwitter'),
	streamHandler = require('./utils/streamHandler');

// Twitter keys stored in .env
require('dotenv').config();

// Create express instance and set port var
var app = express();
var port = process.env.PORT || 8080;

// Set handlebars as templating engine
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Disable etag headers on responses
app.disable('etag');

// Create a new ntwitter instance
var twit = new twitter(config.twitter);

// Index route
app.get('/', routes.index);

// Page route
app.get('/page/:page/:skip', routes.page);

// Set /public as static content directive
app.use('/', express.static(__dirname + "/public"));

// Starrt the server
var server = http.createServer(app).listen(port, function() {
	console.log('Magic happens at port ' + port);
});

// Initialize socket.io
var io = require('socket.io').listen(server);

// Set a stream listener for Game of Thrones tweets
twit.stream('statuses/filter', {
	track: 'GoT, GameofThrones',
}, function(stream) {
	streamHandler(stream, io);
});
