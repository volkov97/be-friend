define(['gui', 'multiplayer', 'notify'], function(gui, onlineUser, notify) {

    var app = {};

    app.init = function() {
        onlineUser.connect();
        gui.setEventListenerOnAuth();

        notify.askPermission();
    };

    return app;

});