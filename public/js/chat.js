var chatApp = angular.module('chatApp', ['ngSanitize', 'luegg.directives']);

chatApp.controller('chatCtl', function($scope, $http, ng_socket) {

    $scope.crfocus = false;

	$scope.chat = {
		currMsg: "",
	}

    $scope.user = user;

	$scope.allMessages = [];
    $scope.chatRooms = [];
    $scope.currCR = {};
    $scope.crDetails;

    $scope.getMessages = function(roomId) {
        $http({
            method: "GET",
            url: '/getMessages?room=' + roomId,
        }).then(function(res){
            if(res && res.data) {
                console.log(res.data);
                $scope.allMessages = res.data;
            }
        }, function(err){
            console.log(err);
        })
    }

    $scope.isRepeatedUserMsg = function(i) {
        if(i > 0) {
            var u = $scope.allMessages[i].user.phone;
            var pu = $scope.allMessages[i-1].user.phone;
            if(u != pu) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    //$scope.getMessages(null, $scope.chatRoom);

    $scope.getDefaultChatRooms = function() {
        $http({
            method: "GET",
            url: '/chatrooms/getDefaults',
        }).then(function(res){
            if(res && res.data) {
                $scope.chatRooms = $scope.chatRooms.concat(res.data);
            }
        }, function(err){
            console.log(err);
        })
    }

    $scope.getDefaultChatRooms();

    $scope.chatRoomsFilter = function(cr) {
        if(!$scope.crtext) {
            return true;
        }

        if(cr.name.toLowerCase().indexOf($scope.crtext.toLowerCase()) != -1) {
            return true;
        }

        return false;
    }

    ng_socket.emit('join', user._id);

    $scope.getChatRoomDetail = function(id, callback) {
        $http({
            method: "GET",
            url: '/chatroom/getCR?_id='+id,
        }).then(function(res){
            if(res && res.data) {
                $scope.crDetails = res.data;
                callback();
            }
        }, function(err){
            console.log(err);
        })    
    }

    $scope.showCRInfo = function() {
        $('#main-panel, #chat-input-box').animate({
            "width": "45%"
        }, 300, function(){
            $('#chat-container').getNiceScroll().resize();
        });
        $('#cr-panel').show("slide", {direction: 'right'}, 300);
        $scope.getChatRoomDetail($scope.currCR._id, function(){
            $('#cr-panel-infos').getNiceScroll().resize();
        })
    }

    $scope.chatRoomClicked = function(cr) {
        if($scope.currCR._id != cr._id) {
            $scope.currCR = cr;
            $('#main-panel, #chat-input-box').animate({
                "width": "70%"
            }, 300, function(){
                $('#chat-container').getNiceScroll().resize();
            });
            $('#cr-panel').hide("slide", {direction: 'right'}, 300);
            $scope.getMessages(cr._id);
        }
        if(cr.lastMsg) {
            cr.lastMsg.pending = 0;
        }
        //$scope.getChatRoomDetail(cr._id);
    }

    $scope.closeCRPanel = function() {
        $('#main-panel, #chat-input-box').animate({
            "width": "70%"
        }, 300, function(){
            $('#chat-container').getNiceScroll().resize();
        });
        $('#cr-panel').hide("slide", {direction: 'right'}, 300);
    }

	$scope.sendMsg = function(e) {
		if(e.keyCode == 13) {
			ng_socket.emit('message', {msg: $scope.chat.currMsg, user: user, CR: {_id: $scope.currCR._id, name: $scope.currCR.name, type: $scope.currCR.type}});
			$scope.allMessages.push({
				msg: $scope.chat.currMsg,
                user: user,
			});
            var msgCR = $scope.chatRooms.filter(function(c){return c._id == $scope.currCR._id})[0];
            msgCR.lastMsg = {
                msg: $scope.chat.currMsg,
                user: user,
                created: new Date(),
                pending: 0,
            }
            $scope.chat.currMsg = "";
		}
	}

	ng_socket.on('message', function(data) {
        if(data.CR._id == $scope.currCR._id) {
    		$scope.allMessages.push({
    			msg: data.msg,
                user: data.user,
    		});
        }

        var msgCR = $scope.chatRooms.filter(function(c){return c._id == data.CR._id})[0];
        msgCR.lastMsg = {
            msg: data.msg,
            user: data.user,
            created: new Date(),
            pending: 1,
        }
	})
});

chatApp.factory('ng_socket', function ($rootScope) {
    // Establish the socket connection with the Server.
    var host = window.location.hostname + ':3000';
    if(io) {
        var ng_socket = io.connect(host, { query: "user="+user._id});
        return {
            on: function (eventName, callback) {
                ng_socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(ng_socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                ng_socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(ng_socket, args);
                        }
                    });
                })
            }
        };
    }
});