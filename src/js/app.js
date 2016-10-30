define(['events', 'multiplayer', 'notify', 'sw', 'promise', 'audio'], function(events, onlineUser, notify, sw, promise, audio) {

    var app = {};

    app.init = function() {

        onlineUser.connect();
        audio.init();

        events.connectHeaderButtons();

        if (sw.register()) {
            console.log("Service Workers are not working!");
        }
    };

    return app;

});