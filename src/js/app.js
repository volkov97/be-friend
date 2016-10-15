define(['gui', 'multiplayer', 'notify', 'sw'], function(gui, onlineUser, notify, sw) {

    var app = {};

    app.init = function() {

        onlineUser.connect();
        gui.setEventListenerOnAuth();

        if (sw.register()) {
            console.log("Service Workers are not working!");
        }
    };

    return app;

});