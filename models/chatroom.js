var mongoose = require('mongoose')
var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId,
	User = require('./user'),
	Message = require('./messages');

var ChatRoomSchema = new Schema({
	name: {type: String, index: true},
    users: [{type: ObjectId, ref: 'User'}],
    avatarUrl: {type: String, defaut: ''},
    type: {type: Number, defaut: 0}, // 0 - Default, 1 - Individual 
    theme: {type: Object},
    lastMsg: {type: ObjectId, ref: 'Message'}
});

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);