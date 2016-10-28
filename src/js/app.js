define(['events', 'multiplayer', 'notify', 'sw', 'promise'], function(events, onlineUser, notify, sw, slick, promise) {

    var app = {};

    app.init = function() {

        onlineUser.connect();
        events.triggerFullscreen();
        events.setEventListenerOnAuth();

        if (sw.register()) {
            console.log("Service Workers are not working!");
        }
    };

    return app;

});