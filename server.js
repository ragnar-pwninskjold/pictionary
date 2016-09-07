var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

count = 0;
userList = 0;

var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];

io.on('connection', function(socket) {
	if (count < 1) {
		socket.drawerer = true;
		word = WORDS[Math.floor(Math.random()*WORDS.length)];

		io.sockets.emit('newGame', [socket.drawerer, word]);
	}
	else {
		socket.drawerer = false;
	}

	console.log(socket.drawerer);
	count+=1;

	socket.on('draw', function(data) {
		socket.broadcast.emit('draw', data);
	});

	socket.on('guess', function(data) {
		io.sockets.emit('guess', data);
	});

	socket.on('guess', function(data) {
		if (data == word) {
			io.sockets.emit('winner', socket.client.id);
		}
	});

	/*socket.on('newGame', function() {
		socket.drawerer = true;
		word = WORDS[Math.floor(Math.random()*WORDS.length)];
		socket.emit('newGame', [socket.drawerer, word]);
		socket.drawerer = false;
		socket.broadcast.emit('newGame', [socket.drawerer, null]);
	});*/

});

server.listen(process.env.PORT || 8080);