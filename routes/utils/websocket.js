var socketio = require('socket.io');
var io;

var message_helper = require('../helpers/message_helper');

exports.setConnection = function(server, sessionMiddelware) {
	io = socketio(server);
	io.use(function(socket, next) {
		sessionMiddelware(socket.request, {}, next);
	});

	io.on('connection', function(socket) {
		socket.on("join", function(userId) {
			socket.join(userId);
  		});

		socket.on('disconnect', function() {
			console.log(socket.handshake.query.user);
			console.log("Socket disconnected");
        });

        socket.on('message', function(data) {
        	message_helper.saveMessage(data);
        	if(data.CR.type == 0) {
				socket.broadcast.emit('message', {msg: data.msg, user: data.user, CR: data.CR});
			} else {

			}
		});
	});
}