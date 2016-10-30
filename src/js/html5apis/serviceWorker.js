define([], function() {

    var sw = {};

    sw.register = function() {
        if ('serviceWorker' in navigator) {
            console.log('Service Worker is supported');

            navigator.serviceWorker.register('sw.js').then(function() {
                return navigator.serviceWorker.ready;
            }).then(function(reg) {
                console.log('Service Worker is ready :^)', reg);

                // do smthng with sw

            }).catch(function(error) {
                console.log('Service Worker error: ', error);
            });

            return true;
        }
    };

    return sw;

});
