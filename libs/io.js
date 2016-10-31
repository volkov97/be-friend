module.exports = function(server) {
    var io = require('socket.io').listen(server);

    io.on('connection', function(socket){
        console.log('user connected');
        
        socket.on('identification', function(obj) {
            console.log('user identification');

            socket.udata = obj;
            socket.udata.points = 0;

            io.emit('update online users list', getOnlineSocketsInfo());
        });

        socket.on('game request', function(obj) {
            console.log('new game request');

            io.to(getSocketIdByVkId(obj.to)).emit('game request', {
                from: obj.from,
                roomName: obj.roomName
            });
        });

        socket.on('multiplayer create', function(obj) {
            console.log("creating new room \'" + obj.roomName + "\'");

            socket.join(obj.roomName);

            if (roomExists(obj.roomName)) {
                roomOpen(obj.roomName);

                io.to(obj.roomName).emit('update online room list', {
                    key: obj.roomName,
                    list: getUsersInRoom(obj.roomName)
                });
            }
        });

        socket.on('multiplayer join', function(obj) {
            console.log("joining room \'" + obj.roomName + "\'");

            if (roomExists(obj.roomName) && roomOpenedStatus(obj.roomName)) {
                socket.join(obj.roomName);

                io.to(obj.roomName).emit('update online room list', {
                    key: obj.roomName,
                    list: getUsersInRoom(obj.roomName)
                });
            } else {
                io.emit('room not exists');
            }

        });

        socket.on('multiplayer set room options', function(obj) {
            if (roomExists(obj.roomName) && obj.options) {
                io.nsps["/"].adapter.rooms[obj.roomName].maxScore = obj.options.maxScore;
            }
        });

        socket.on('choose new question', function(obj) {
            if (roomExists(obj.roomName)) {
                roomClose(obj.roomName);

                io.to(obj.roomName).emit('choosed question', {
                    num: chooseTypeOfQuestion()
                });
            } else {
                console.log("Trying to get question for unexisting room!")
            }
        });

        socket.on('multiplayer answer', function(obj) {
            socket.udata.points += obj.points;

            if (roomExists(obj.roomName)) {
                var endGame = false;
                console.log("AAAAAAA");
                if (socket.udata.points >= io.nsps["/"].adapter.rooms[obj.roomName].maxScore) {
                    console.log("BBBBBBBBBB");
                    endGame = true;
                }

                io.to(obj.roomName).emit('update online room list', {
                    key: obj.roomName,
                    list: getUsersInRoom(obj.roomName),
                    endGame: endGame
                });
            }
        });

        socket.on('leave room', function(obj) {
            socket.leave(obj.roomName);
            socket.udata.points = 0;

            console.log("room -1");

            io.to(obj.roomName).emit('update online room list', {
                key: obj.roomName,
                list: getUsersInRoom(obj.roomName)
            });
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');

            if (socket.udata) {
                // if user was identified
                io.emit('update online users list', getOnlineSocketsInfo());
            }
        });
    });

    function roomExists(room) {
        return io.nsps["/"].adapter.rooms[room] ? true : false;
    }

    function roomOpenedStatus(room) {
        return io.nsps["/"].adapter.rooms[room].opened ? true : false;
    }

    function roomOpen(room) {
        io.nsps["/"].adapter.rooms[room].opened = true;
    }

    function roomClose(room) {
        io.nsps["/"].adapter.rooms[room].opened = false;
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

    function getOnlineSocketsInfo() {
        var info = [];

        for (var clientId in io.sockets.connected) {
            if (io.sockets.connected[clientId].udata) {
                info.push(io.sockets.connected[clientId].udata);
            }

        }

        return info;
    }

    return io;
};



function chooseTypeOfQuestion() {
    var QUESTIONS_COUNT = 10;

    return Math.round(Math.random() * (QUESTIONS_COUNT - 1));
}
