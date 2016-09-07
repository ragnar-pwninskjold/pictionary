var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function(socket) {


	socket.on('draw', function(data) {
		socket.broadcast.emit('draw', data);
	});

	socket.on('guess', function(data) {
		io.sockets.emit('guess', data);
	});

});

server.listen(process.env.PORT || 8080);