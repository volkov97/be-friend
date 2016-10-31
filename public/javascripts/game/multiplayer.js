define(["require","socketio","vkapi","notify","gameLogic"],function(o,e,t,n,i){var m={socket:null,room:null};return m.setRoom=function(o){m.room=o},m.getRoom=function(){return m.room},m.clearRoom=function(){m.socket.emit("leave room",{roomName:m.getRoom()}),m.room=null},m.connect=function(){m.socket=e()},m.identify=function(e){m.socket.emit("identification",e),m.socket.on("update online users list",function(e){o("gui").updateOnlinePlayersList(e)}),m.socket.on("update online room list",function(e){o("gui").updateOnlineRoom(e)}),m.socket.on("choosed question",function(e){o("gui").drawQuestion(i.makeNewQuestion(e.num),!0)}),m.socket.on("room not exists",function(e){o("gui").showMultiplayerError("Извините, но такой комнаты не существует или игра в данной комнате уже начилась, проверьте секретный код еще раз")}),m.socket.on("game request",function(o){n.showNotification("gameRequest","Вас вызывают на дуэль!",o.from.first_name+" "+o.from.last_name+" (id"+o.from.id+") хочет проверить, кто лучше знает Ваших общих друзей! Примите вызов? (ключ "+o.roomName+")",o.from.img_src,!0)})},m.createRoom=function(o){var e=o.toString().substr(0,3)+Math.floor(1e3*Math.random());return m.setRoom(e),m.socket.emit("multiplayer create",{roomName:m.getRoom()}),e},m.joinRoom=function(o){m.setRoom(o),m.socket.emit("multiplayer join",{roomName:o})},m.setRoomOptions=function(o,e){m.socket.emit("multiplayer set room options",{roomName:o,options:e})},m.getNewQuestion=function(o){m.socket.emit("choose new question",{roomName:o})},m.answer=function(o){m.socket.emit("multiplayer answer",{vk_id:o.vk_id,roomName:o.roomName,points:o.points,right:o.right}),o.right&&m.getNewQuestion(o.roomName)},m.sendRequestTo=function(o,e){m.socket.emit("game request",{from:t.getUserInfo(),to:o,roomName:e})},m});