define([], function() {

    var sw = {};

    sw.register = function() {
        navigator.serviceWorker.register('sw.js');
    };

    return sw;

});
