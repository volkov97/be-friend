define(['events', 'multiplayer', 'notify', 'sw'], function(events, onlineUser, notify, sw, slick) {

    var app = {};

    app.init = function() {

        onlineUser.connect();
        events.setEventListenerOnAuth();

        if (sw.register()) {
            console.log("Service Workers are not working!");
        }
    };

    return app;

});