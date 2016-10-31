define(
    [
        'sw',
        'audio'
    ],
    function(
        sw,
        audio
    ) {

        function _isNewNotificationSupported() {
            if (!window.Notification || !Notification.requestPermission)
                return false;
            if (Notification.permission == 'granted')
                throw new Error('You must only call this \*before\* calling Notification.requestPermission(),\ ' +
                    'otherwise this feature detect would bug the user with an actual notification!');

            try {
                new Notification('');
            } catch (e) {
                if (e.name == 'TypeError')
                    return false;
            }

            return true;
        }

        function _showServiceWorkerNotification(title, text, src) {
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

        function _makeCustomNotification(type, title, text, src, enableButtons) {
            var imageHTML = '';

            if (src) {
                imageHTML = '<div class="notification__image">' +
                    '<img src="' + src + '" width=100 height=100 />' +
                    '</div>'
            }

            var activities = '<div class="notification__activities">' +
                '<button class="confirm">Принять</button>' +
                '<button class="reject">Отказать</button>' +
                '</div>';

            var notificationHTML = '<div class="' + type + ' notification animated bounceInUp">' +
                '<a class="notification__close" href="#">' +
                '<svg class="vk" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                '<use xlink:href="#close"></use>' +
                '</svg>' +
                '</a>' +
                '<div class="notification__header">Уведомление</div>' +
                '<div class="notification__content clearfix">' +
                imageHTML +
                '<div class="notification__title">' + title + '</div>' +
                '<div class="notification__text">' + text +'</div>' +
                '</div>' +
                (enableButtons ? activities : '') +
                '</div>';

            $('body').append(notificationHTML);
            audio.notification();
        }

        var notify = {};

        notify.showNotification = function(type, title, text, src, enableButtons) {

            if (window.Notification && Notification.permission == 'granted') {
                // We would only have prompted the user for permission if new
                // Notification was supported (see below), so assume it is supported.
                _showServiceWorkerNotification(title, text, src);
            } else if (_isNewNotificationSupported()) {
                // new Notification is supported, so prompt the user for permission.
                Notification.requestPermission(function(result) {
                    if (result === 'granted') {
                        _showServiceWorkerNotification(title, text, src);
                    }
                });
            }

            _makeCustomNotification(type, title, text, src, enableButtons);
        };

        return notify;
});

