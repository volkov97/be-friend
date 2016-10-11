define(['require', 'socketio', 'vkapi', 'notify'], function (require, io, vkapi, notify) {

    var onlineUser = {
        socket: null
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

        onlineUser.socket.on('game request', function(obj) {
            console.log(obj);

            notify.makeNotification("GAME REQUEST", "FROM " + obj.from);
        });
    };

    onlineUser.sendRequestTo = function(id) {
        onlineUser.socket.emit('game request', {
            from: vkapi.getUser(),
            to: id
        });
    };

    return onlineUser;
});