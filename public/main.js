socket = io();

socket.on('newGame', function(data) {
        if (data[0] == true) {
            socket.drawerer = true;
            alert("The word for you to draw is: "+data[1]);
        }
    });

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
        console.log(guess);
        socket.emit('guess', guess);
        $("#guess-input").val('');
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
        alert("The client with id: " +data+ " has won!");
    });
};

$(document).ready(function() {
    pictionary();
});