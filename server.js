var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

count = 0;
clientCount = 0;
userList = [];

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
	console.log("Client count: " + io.sockets.server.eio.clientsCount);
	clientCount++;
	userList.push(socket.client.id);
	console.log("User list array: " + userList);
	if (count < 1 || clientCount<=1) {
 		word = WORDS[Math.floor(Math.random()*WORDS.length)];
 		socket.emit('newGame', [true, word]);
 	}
 
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
			word = WORDS[Math.floor(Math.random()*WORDS.length)];
			socket.emit('newGame', [true, word]);
			socket.broadcast.emit('newGame', [false, null]);

				//set drawerer flag to false for everyone
				//emit newGame to just that client with true and a word		
		}
	});

	socket.on('tooLow', function() {
		console.log('tooLow');
		word = WORDS[Math.floor(Math.random()*WORDS.length)];
		socket.emit('newGame', [true, word]);
	});

	socket.on('disconnect', function() {
		io.sockets.emit('disconnect');
		clientCount--;
		console.log("socket that disconnected:  " +socket.client.id);
		io.sockets.emit('whoLeft', socket.client.id);
		console.log(clientCount);
		if(clientCount < 2) {
			console.log('here');
			io.sockets.emit('tooLow');
		}
		//if there are no guessers, stop the game, or alert 'drawing for no one'
		//if drawerer disconnects, run a new game with a randomly assigned drawerer
	});

	socket.on('drawererLeft', function(data) {
		//console.log("The drawerer id, sent from client: "+data);
		//var newDrawerer = userList[Math.floor(Math.random() * userList.length)];
		//io.sockets.emit('newDrawerer', newDrawerer);
		console.log("Correct drawerer that left logging");
	});

	

});

server.listen(process.env.PORT || 8080);