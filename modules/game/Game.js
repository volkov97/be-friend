function Game() {

    var sockets_connected = {};
    var self = this;

    this.connectSocket = function(vk_id, socket) {
        sockets_connected[vk_id] = socket;
    };

    this.disconnectSocket = function(vk_id) {
        delete sockets_connected[vk_id];
    };

    this.writeAllConnectedSockets = function() {
        self.writeAllConnectedSockets();
    };

    this.getSocketIdByVkId = function(vk_id) {
        return sockets_connected[vk_id].id;
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

        self.writeAllConnectedSockets();

        return info;
    };

    return this;
}

module.exports = new Game();