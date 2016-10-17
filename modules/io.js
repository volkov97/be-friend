module.exports = function(server) {
    var io = require('socket.io').listen(server);

    io.on('connection', function(socket){
        console.log('user connected');
        
        socket.on('identification', function(obj) {
            console.log('user identification');

            socket.udata = obj;
            socket.udata.points = 0;

            io.emit('update online users list', getOnlineSocketsInfo(io));
        });

        socket.on('game request', function(obj) {
            console.log('new game request');
            console.log(obj);

            io.to(getSocketIdByVkId(obj.to)).emit('game request', {
                from: obj.from
            });
        });

        socket.on('multiplayer create', function(obj) {
            console.log("creating new room \'" + obj.roomName + "\'");

            socket.join(obj.roomName);

            io.to(obj.roomName).emit('update online room list', {
                key: obj.roomName,
                list: getUsersInRoom(obj.roomName)
            });
        });

        socket.on('multiplayer join', function(obj) {
            console.log("joining room \'" + obj.roomName + "\'");

            if (roomExists(obj.roomName)) {
                socket.join(obj.roomName);

                io.to(obj.roomName).emit('update online room list', {
                    key: obj.roomName,
                    list: getUsersInRoom(obj.roomName)
                });
            } else {
                io.emit('room not exists');
            }

        });

        socket.on('choose new question', function(obj) {
            if (roomExists(obj.roomName)) {
                io.to(obj.roomName).emit('choosed question', {
                    num: chooseTypeOfQuestion()
                });
            } else {
                console.log("Trying to get question for unexisting room!")
            }
        });

        socket.on('multiplayer answer', function(obj) {
            // getSocketIdByVkId(obj)
            socket.udata.points += obj.points;

            io.to(obj.roomName).emit('update online room list', {
                key: obj.roomName,
                list: getUsersInRoom(obj.roomName)
            });
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');

            if (socket.udata) {
                // if user was identified
                io.emit('update online users list', getOnlineSocketsInfo(io));
            }
        });
    });

    function roomExists(room) {
        if (io.nsps["/"].adapter.rooms[room]) {
            return true;
        } else {
            return false;
        }
    }

    function getSocketIdByVkId(vk_id) {
        console.log('get socket id by vk_id');

        for (var cliendId in io.sockets.connected) {
            if (io.sockets.connected[cliendId].udata && io.sockets.connected[cliendId].udata.id == vk_id) {
                return cliendId;
            }
        }
    }

    function getUsersInRoom(roomName) {
        var info = [];

        if (roomExists(roomName)) {
            var socketsInRoom = io.nsps["/"].adapter.rooms[roomName].sockets;
            for (var socketID in socketsInRoom) {
                info.push(io.sockets.connected[socketID].udata);
            }
        }

        return info;
    }

    return io;
};

function getOnlineSocketsInfo(io) {
    var info = [];

    for (var cliendId in io.sockets.connected) {
        if (io.sockets.connected[cliendId].udata) {
            info.push(io.sockets.connected[cliendId].udata);
        }

    }

    return info;
}

function chooseTypeOfQuestion() {
    var QUESTIONS_COUNT = 10;

    return Math.round(Math.random() * (QUESTIONS_COUNT - 1));
}
