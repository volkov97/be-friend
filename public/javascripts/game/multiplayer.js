define(['socketio'], function (io) {

    var onlineUser = {
        socket: null
    };

    onlineUser.connect = function() {
        onlineUser.socket = io();
    };

    onlineUser.identify = function(obj) {
        onlineUser.socket.emit('identification', obj);

        onlineUser.socket.on('update online users list', function(list) {
            //gui.updateOnlinePlayersList();
            //gui.updateOnlinePlayersList = function(list) {
            var code = "";

            for (var i = 0; i < list.length; i++) {
                code += "<li><a href=\'https://vk.com/id" + list[i].id + "\'>" +
                    list[i].first_name + " " + list[i].last_name + "</a></li>"
            }

            $('.playersList').html(code);
            //};
        });
    };

    return onlineUser;

});