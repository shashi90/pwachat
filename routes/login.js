var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Passports = require('../passports');
var User = require('../models/user');
var userPassport = Passports(User, 'User');
var OTP = require('../models/otp');
var moment = require('moment');

module.exports = function(app) {
	app.get('/login', function(req, res) {
		if (req.isAuthenticated()) {
			return res.redirect("/chat");
		} else {
			var redirectUrl = req.session.redirectedUrl;
			req.session.redirectedUrl = null;
			res.header("Cache-Control", "no-cache, no-store, must-revalidate");
			res.header("Pragma", "no-cache");
			res.header("Expires", 0);
			return res.render('login', {
				title : 'Login',
				redirectUrl: redirectUrl,
			});
		}
	});

	app.post('/generateOTP', function(req, res) {
		var phone = req.body.phone;
        OTP.remove({
            phoneno: phone,
        }, function(error) {
            if (error) {
                console.log("error while removing the doc");
            } else {
                console.log("success removing the doc");
            }

            var registerTime = Date.now();
            var otp = Math.floor(1000 + Math.random() * 9000);
            var otpItem = new OTP({
                phone: phone,
                created: registerTime,
                otp: otp,
            });
                    
            otpItem.save(function(err, clientOTPItem) {
                if (err) {
                    return res.json({
                        status: 0,
                        Msg: "Error while generating OTP.Please try again."
                    });
                } else {
                    var msg = "Your OTP to validate your mobile number is " + otp + ". It is valid for 15 mins only";
                    console.log(msg);
                    //sms.sendMsg(obj,phoneNo, msg, msgtype);
                    User.findOne({
                        phone: phone,
                    },
                    function(err, user) {
                        if(!user) {
                            return res.json({
                                status: 1,
                                Msg: "OTP generated and sent to the client"
                           });
                        } else {
                            return res.json({
                                status: 1,
                                Msg: "Otp generated and sent to the client",
                                name: user.name,
                               	email: user.email,
                            })
                        }
                    });
                }
            });     
        });
	})

	// sign up / login
	app.post('/verifyOTP', function(req, res) {
        
        var phone = req.body.phone;
        var name = req.body.name;
        var email = req.body.email;
        var otp = req.body.otp;

		OTP.findOne({
            phone: phone,
            otp: otp
        }, function(err, item){
            if (err) {
                res.json({
                    status: 0,
                    Msg: "Error while retrieving OTP."
                });
            }        
            if (!item) {
                res.json({
                    status: 0,
                    Msg: "Invalid OTP."
                });
            } else {       
                OTP.remove({
                    phone: phone,
                }, function(error) {
                    if (error) {
                        console.log("error while removing the doc");
                    }
                    else {
                        console.log("success removing the doc");
                    }
                });
                var generatedTime = moment(item.created).format();
                var now = moment();
                var diff = now.diff(generatedTime, "minutes");
                if (diff <= 15) {
                	console.log(phone + " " + otp);
                    User.findOne({
                        phone: phone,
                    }, function(err, user) {
                        if(!user) {
                            var newUser = new User({
                                phone: phone,
                                email: email,
                                name: name,
                            });
                            newUser.save(function(err, u) {
                                if(!err) {
                                    req.logIn(u, function(err) {
                                        if(err) {
                                            console.log(err);
                                            return res.json({status: 0, msg: "Login Failed"});
                                        }
                                        res.cookie('connect.sid', req.cookies['connect.sid'] , {
                                            maxAge : 315360000000,
                                        });
                                        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                                        res.header("Pragma", "no-cache");
                                        res.header("Expires", 0);
                                        return res.json({
                                            status: 1,
                                            Msg: "Verified",
                                        });
                                    });
                                }
                                else {
                                    console.log("Error "+ err);
                                    return res.json({
                                    	status: 0,
                                    	Msg: err,
                                    })
                                }
                            });
                        } else {
                            req.logIn(user, function(err) {
                                if(err) {
                                    console.log(err);
                                    return res.json({status: 0, msg: "Login Failed"});
                                }
                                res.cookie('connect.sid', req.cookies['connect.sid'] , {
                                    maxAge : 315360000000,
                                });
                                res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                                res.header("Pragma", "no-cache");
                                res.header("Expires", 0);
                                return res.json({
                                    status: 1,
                                    Msg: "Verified",
                                });
                            });
                        }
                    });
                } else {
                    return res.json({
                        status: -1,
                        Msg: "OTP expired",
                    });
                }
           	}
        });
	});
	
	app.get('/logout',function (req, res){
		res.header("Cache-Control", "no-cache, no-store, must-revalidate");
		res.header("Pragma", "no-cache");
		res.header("Expires", 0);
		req.logout();
		res.redirect('/login');
	});
}