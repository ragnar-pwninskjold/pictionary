socket = io();
count=0;

console.log(socket);

var drawing;

var pictionary = function() {
    var canvas, context;

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
        canvas.on('mousemove', function(event) {
            if (socket.drawerer == true) {
                if (drawing == true) {
                    var offset = canvas.offset();
                    var position = {x: event.pageX - offset.left,
                                    y: event.pageY - offset.top};
                    draw(position);
                    socket.emit('draw', position);
                }
            }
        });

    $("#guess-input").on("keydown", function(event) {
        if (event.keyCode != 13) {
            return;
        }
        guess = $("#guess-input").val();
        socket.emit('guess', guess);
        $("#guess-input").val('');
    });

    $("#clear").on("click", function() {
        clearCanvas();
    });

    canvas.on('mousedown', function(event) {
        drawing = true;
    });

    canvas.on('mouseup', function(event) {
        drawing = false;
    }); 

    socket.on('draw', function(position) {
        draw(position);
    });

    socket.on('guess', function(guess) {
        $("#the-guess").text(guess);
    });

    socket.on('winner', function(data) {
        $("#winner").text("The person with id: "+data+ " has won the game");
        socket.drawerer = false;
        //make a display for the word and also hide it for everyone
        //show everyone the guess box

    });

    socket.on('disconnect', function() {
        count++;
        var disc = document.getElementById("room-log");
         while(disc.firstChild) {
            disc.removeChild(disc.firstChild);
        }
        $("#room-log").append("Someone has left the game"+"("+count+")");
        /*if (socket.drawerer == true) {
            //console.log("logging client id from client side" + socket.id);
            socket.emit('drawererLeft', socket.id);
        }*/
    });

    socket.on('tooLow', function() {
        alert("You're currently the only one here");
        socket.emit('tooLow');
        socket.drawerer = true;
    });

    socket.on('newDrawerer', function(data) {
        if (socket.client.id == data) {
            socket.drawerer = true;
        }
    });

    socket.on('whoLeft', function(data) {
        console.log(data + "id for who left");
        console.log(socket.id + "id for the socket of this connection");
        console.log("boolean for if this is drawerer: " + socket.drawerer);
        if (socket.drawerer == true) {
            console.log(socket.id + " id for the drawerer");
        }
        if (socket.id == data) {
            socket.emit('drawererLeft');
            console.log(data+"adsfadsfasdfasd");
        }
    });

    socket.on('newGame', function(data) {
        clearCanvas();

        if (data[0] == true) {
             socket.drawerer = true;
             $("#guess").hide();
             var word = document.getElementById("word");
             while(word.firstChild) {
                word.removeChild(word.firstChild);
            }
             $("#word").show().append("The word for you to draw is: "+data[1]);
        }

        else {
            $("#guess").show();
            $("#word").hide();
            socket.drawerer = false;
        }
    });

};

var clearCanvas = function() {
    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    context.clearRect(0, 0, canvas[0].width, canvas[0].height);
};

$(document).ready(function() {
    pictionary();
});