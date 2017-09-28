
var utils = require('../utils');
var User = require('../../models/user')
var message_helper = require('../helpers/message_helper');

module.exports = function(app) {
	app.get('/chat', function(req, res) {
		if(!utils.checkIfSecure(req, res)) return;
		User.update({
			_id: req.user._id,
		}, {
			$set: {
				liveNow: true,
			}
		}, function(err, result) {
			if(err) {
				console.log(err);
			}
		});

		var user = {
			_id: req.user._id,
			name: req.user.name,
			phone: req.user.phone,
			email: req.user.email,
			theme: req.user.theme,
			avatarUrl: req.user.avatarUrl,
		}

		return res.render("client/chat", {
			user: user,
		})
	});

	app.get('/getMessages', function(req, res) {
		if(!utils.checkIfSecure(req, res)) return;
		message_helper.getMessages(req.query.room, function(err, data) {
			if(err) {
				return res.json([]);
			} else {
				return res.json(data);
			}
		})
	})
}