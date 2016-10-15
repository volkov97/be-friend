define(['sw'], function(sw) {

    var notify = {};

    notify.showNotification = function(title, text, src) {

        Notification.requestPermission(function(result) {
            if (result === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                    registration.showNotification(title, {
                        body: text,
                        dir: 'auto', // or ltr, rtl
                        lang: 'RU', //lang used within the notification.
                        tag: 'notificationPopup', //An element ID to get/set the content
                        icon: src //The URL of an image to be used as an icon
                    });
                });
            }
        });
    };

    return notify;

});

