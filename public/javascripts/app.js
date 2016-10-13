define(['gui', 'multiplayer', 'notify', 'sw'], function(gui, onlineUser, notify, sw) {

    var app = {};

    app.init = function() {




        onlineUser.connect();
        gui.setEventListenerOnAuth();

        sw.register();
    };

    return app;

});