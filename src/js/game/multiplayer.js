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