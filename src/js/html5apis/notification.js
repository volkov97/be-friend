define(['sw'], function(sw) {

    var notify = {};

    notify.showNotification = function(type, title, text, src, enableButtons) {
        /*
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
        */

        var imageHTML = '';
        if (src) {
            imageHTML = '<div class="notification__image">\
                             <img src="' + src + '" width=100 height=100 />\
                         </div>';
        }

        var activities = '<div class="notification__activities">\
                             <button class="confirm">Принять</button>\
                             <button class="reject">Отказать</button>\
                          </div>';

        var notificationHTML = '<div class="' + type + ' notification animated bounceInUp">\
                                    <a class="notification__close" href="#">\
                                        <svg class="vk" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
                                            <use xlink:href="#close"></use>\
                                        </svg>\
                                    </a>\
                                    <div class="notification__header">Уведомление</div>\
                                    <div class="notification__content clearfix">\
                                        ' + imageHTML + '\
                                        <div class="notification__title">' + title + '</div>\
                                        <div class="notification__text">' + text +'</div>\
                                    </div>\
                                    ' + (enableButtons ? activities : '') + '\
                                </div>';

        $('body').append(notificationHTML);
    };

    return notify;

});

