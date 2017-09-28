var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var OTPSchema = new Schema({
	phone: {type: String, required: true},
	otp: Number,
	created: {type: Date, default: Date.now},
});

module.exports = mongoose.model('OTP', OTPSchema);