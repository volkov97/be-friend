var game = require('../modules/game/Game');

module.exports = function(server) {
    var io = require('socket.io').listen(server);

    io.on('connection', function(socket){
        console.log('user connected');
        
        socket.on('identification', function(obj) {
            console.log('user identification');

            socket.udata = obj;
            game.connectSocket(socket.udata.id, socket);

            io.emit('update online users list', game.getOnlineSocketsInfo());
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');

            if (socket.udata) {
                // if user was identified

                game.disconnectSocket(socket.udata.id);
            }
        });
    });

    return io;
};
