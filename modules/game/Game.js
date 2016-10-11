function Game() {

    var sockets_connected = {};

    this.connectSocket = function(id, socket) {
        sockets_connected[id] = socket;
    };

    this.disconnectSocket = function(id) {
        delete sockets_connected[id];
    };

    this.getSocketIdByVkId = function(vkID) {
        for (var key in sockets_connected) {
            if (sockets_connected[key].udata.id == vkID) {
                return sockets_connected[key].id;
            }
        }
    };

    this.getOnlineSocketsInfo = function() {
        var info = [];

        for (var key in sockets_connected) {
            info.push({
                id: sockets_connected[key].udata.id,
                first_name: sockets_connected[key].udata.first_name,
                last_name: sockets_connected[key].udata.last_name
            });
        }

        return info;
    };

    return this;
}

module.exports = new Game();