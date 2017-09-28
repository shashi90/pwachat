var utils = require('../utils');
var Message = require('../../models/messages');
var ChatRoom = require('../../models/chatroom');

exports.saveMessage = function (data) {
	var message = new Message({
		msg: data.msg,
		roomName: data.CR.name,
		roomId: data.CR._id,
		user: data.user._id,
	});

	message.save(function(err, m) {
		if(err) {
			console.log(err);
		}
		ChatRoom.update({
			_id: data.CR._id,
		}, {
			$set: {
				lastMsg: m._id,
			},
			$addToSet: {
				users: data.user._id,
			}
		}, function(errr, result) {
			if(errr) {
				console.log(errr);
			}
		})
	})
}

exports.getMessages = function(room, callback) {
	Message.find({
		roomId: room,
	}).populate('user', '_id phone name email theme').exec(function(err, messages) {
		if(err) {
			callback(err, []);
			return;
		}
		callback(null, messages);
	})
}