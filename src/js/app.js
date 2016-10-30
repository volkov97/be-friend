define(['events', 'multiplayer', 'notify', 'sw', 'promise', 'audio'], function(events, onlineUser, notify, sw, promise, audio) {

    var app = {};

    app.init = function() {

        onlineUser.connect();
        events.triggerFullscreen();
        events.setEventListenerOnAuth();

        if (sw.register()) {
            console.log("Service Workers are not working!");
        }

        audio.init();
    };

    return app;

});