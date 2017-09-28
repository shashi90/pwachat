
var utils = require('../utils');
var ChatRoom = require('../../models/chatroom');

exports.addChatRoomUser = function(userId) {

}

module.exports = function(app) {
	app.get('/chatrooms/getDefaults', function(req, res) {
		if(!utils.checkIfSecure(req, res)) return;

		ChatRoom.find({
			type: 0,
		}).populate([{path: 'users', select: '_id phone name email theme liveNow'}, {path: 'lastMsg', select: 'user msg created'}]).exec(function(err, chatRooms) {
			if(err) {
				console.log(err);
				return res.json([]);
			}
			return res.json(chatRooms);
		})
	});

	app.get('/chatrooms/get', function(req, res) {
		if(!utils.checkIfSecure(req, res)) return;
		ChatRoom.find({
			user: req.user._id,
			type: 1,
		}).populate('user', '_id phone name email theme liveNow').exec(function(err, chatRooms) {
			if(err) {
				return res.json([]);
			}
			return res.json(chatRooms);
		})
	});

	app.get('/chatroom/getCR', function(req, res) {
		if(!utils.checkIfSecure(req, res)) return;
		ChatRoom.findOne({
			_id: req.query._id,
		}).populate([{path: 'users', select: '_id phone name email theme liveNow'}, {path: 'lastMsg', select: 'user msg created'}]).exec(function(err, chatRoom) {
			if(err) {
				return res.json([]);
			}
			return res.json(chatRoom);
		})
	});

	app.post('/chatrooms/addUser', function(req, res) {
		if(!utils.checkIfSecure(req, res)) return;

	});

	app.post('/chatrooms/deleteUser', function(req, res){

	});

	app.get('/chatRooms/createInitials', function(req, res) {
		if(!utils.checkIfSecure(req, res)) return;

		var chatrooms = [{name: "Global", users: [], type: 0},
						{name: "Bartenders", user: [], type: 0},
						{name: "Bar Managers", user: [], type: 0}, 
						{name: "Bussers", user: [], type: 0}, 
						{name: "Butlers", user: [], type: 0},
						{name: "Captains", user: [], type: 0},
						{name: "Cashiers", user: [], type: 0},
						{name: "Executive/Master Chefs", user: [], type: 0},
						{name: "General Managers", user: [], type: 0},
						{name: "Guest Service Agent", user: [], type: 0},
						{name: "Host/Hostess", user: [], type: 0},
						{name: "Lobby/Duty Manager", user: [], type: 0},
						{name: "Steward", user: [], type: 0},
						{name: "Waiter/Waitress/Sommelier", user: [], type: 0}];
		ChatRoom.insertMany(chatrooms, function(err, docs){
			if(err){
				console.log(err);
				return res.json({status: 0});
			}

			return res.json({status: 1});
		})
	})
}