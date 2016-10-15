define([], function() {

    var sw = {
        reg: {},
        sub: {}
    };

    sw.register = function() {
        if ('serviceWorker' in navigator) {
            console.log('Service Worker is supported');
            navigator.serviceWorker.register('sw.js').then(function() {
                return navigator.serviceWorker.ready;
            }).then(function(reg) {
                console.log('Service Worker is ready :^)', reg);

                sw.subscribe(reg);

            }).catch(function(error) {
                console.log('Service Worker error :^(', error);
            });

            return true;
        } else {
            // custom notifications

            return false;
        }
    };

    sw.subscribe = function(reg) {
        sw.reg = reg;

        reg.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function(pushSubscription){
            sub = pushSubscription;
            console.log('Subscribed! Endpoint:', sub.endpoint);
        });
    };

    sw.unsubscribe = function() {
        sub.unsubscribe().then(function(event) {
            console.log('Unsubscribed!', event);
        }).catch(function(error) {
            console.log('Error unsubscribing', error);
        });
    };

    return sw;

});
