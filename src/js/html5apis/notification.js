define(['sw'], function(sw) {

    var notify = {};
    /*
    notify.notification = window.Notification || window.mozNotification || window.webkitNotification;

    notify.askPermission = function() {

        // The user needs to allow this
        if ('undefined' === typeof notify.notification) {
            console.log('Web notification not supported');
        } else {
            notify.notification.requestPermission(function(permission){});
        }
    };

    notify.makeNotification = function(title, text) {
        if ('undefined' === typeof notify.notification)
            return false;       //Not supported....
        var noty = new  notify.notification(
            title, {
                body: text,
                dir: 'auto', // or ltr, rtl
                lang: 'EN', //lang used within the notification.
                tag: 'notificationPopup', //An element ID to get/set the content
                icon: '' //The URL of an image to be used as an icon
            }
        );
        noty.onclick = function () {
            console.log('notification.Click');
        };
        noty.onerror = function () {
            console.log('notification.Error');
        };
        noty.onshow = function () {
            console.log('notification.Show');
        };
        noty.onclose = function () {
            console.log('notification.Close');
        };
        return true;
    };
    */

    notify.showNotification = function(title, text) {

        Notification.requestPermission(function(result) {
            if (result === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                    registration.showNotification(title, {
                        body: text,
                        dir: 'auto', // or ltr, rtl
                        lang: 'RU', //lang used within the notification.
                        tag: 'notificationPopup', //An element ID to get/set the content
                        icon: '' //The URL of an image to be used as an icon
                    });
                });
            }
        });
    };

    return notify;

});

