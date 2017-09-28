var mongoose = require('mongoose')
var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId,
	User = require('./user');

var MessageSchema = new Schema({
	msg: String,
	image: String,
	roomId: {type: ObjectId, index: true, ref: 'ChatRoom'},
	roomName: String,
	seenBy: [{type: ObjectId, ref: 'User'}],
	created: {type: Date, default: Date.now},
	deleted: {type: Date},
	user: {type: ObjectId, ref: 'User', index: true},
	file: {
        file: {
            id: mongoose.Schema.Types.ObjectId,
            name: String,
            size: Number,
            mimeType: String
        },
        thumb: {
            id: mongoose.Schema.Types.ObjectId,
            name: String,
            size: Number,
            mimeType: String
        }
    },
    attributes: {},
});

module.exports = mongoose.model('Message', MessageSchema);