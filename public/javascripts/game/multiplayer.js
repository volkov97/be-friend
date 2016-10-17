define(['require', 'socketio', 'vkapi', 'notify', 'gameLogic'], function (require, io, vkapi, notify, gameLogic) {

    var onlineUser = {
        socket: null,
        room: null
    };

    onlineUser.setRoom = function(str) {
        onlineUser.room = str;
    };

    onlineUser.getRoom = function() {
        return onlineUser.room;
    };

    onlineUser.connect = function() {
        onlineUser.socket = io();
    };

    onlineUser.identify = function(obj) {
        onlineUser.socket.emit('identification', obj);

        // Listeners

        onlineUser.socket.on('update online users list', function(list) {
            require('gui').updateOnlinePlayersList(list);
        });

        onlineUser.socket.on('update online room list', function(obj) {
            require('gui').updateOnlineRoom(obj);
        });

        onlineUser.socket.on('choosed question', function(obj) {
            require('gui').drawQuestion(gameLogic.makeNewQuestion(obj.num), true);
        });

        onlineUser.socket.on('room not exists', function(obj) {
            require('gui').noSuchRoom();
        });

        onlineUser.socket.on('game request', function(obj) {
            console.log(obj);

            notify.showNotification(
                "Вас вызывают на дуэль!",
                obj.from.first_name + " "
                + obj.from.last_name
                + " (id" + obj.from.id
                + ") хочет проверить, кто лучше знает Ваших общих друзей! Примите вызов?",
                obj.from.img_src
            );
        });
    };

    onlineUser.createRoom = function(vk_id) {
        onlineUser.setRoom("roomOf" + vk_id);

        onlineUser.socket.emit('multiplayer create', {
            roomName: onlineUser.getRoom()
        });
    };

    onlineUser.joinRoom = function(roomName) {
        onlineUser.setRoom(roomName);

        onlineUser.socket.emit('multiplayer join', {
            roomName: roomName
        });
    };

    onlineUser.getNewQuestion = function(roomName){
        console.log("DAWdwWDDWDWA");
        console.log(roomName);
        onlineUser.socket.emit('choose new question', {
            roomName: roomName
        });
    };

    onlineUser.answer = function(obj) {
        onlineUser.socket.emit('multiplayer answer', {
            vk_id: obj.vk_id,
            roomName: obj.roomName,
            points: obj.points,
            right: obj.right
        });

        if (obj.right) {
            onlineUser.getNewQuestion(obj.roomName);
        }
    };

    onlineUser.sendRequestTo = function(id) {
        console.log("1234")
        console.log(vkapi.getUserInfo());
        onlineUser.socket.emit('game request', {
            from: vkapi.getUserInfo(),
            to: id
        });
    };

    return onlineUser;
});