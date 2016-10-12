define(['gui', 'multiplayer', 'notify', 'sw', 'chart'], function(gui, onlineUser, notify, sw, chart) {

    var app = {};

    app.init = function() {

        chart.drawCharts();


        onlineUser.connect();
        gui.setEventListenerOnAuth();

        sw.register();
    };

    return app;

});