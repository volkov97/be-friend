console.log('Started', self);

var cacheName = 'beFriendCache-v1';
var urlsToCache = [
    '/',
    '/sw.js',
    '/manifest.json',
    '/stylesheets/fonts.css',
    '/stylesheets/main.css',
    '/images/logo.png',
    '/images/friends.jpeg',
    '/images/mp-02.png'
];

this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

this.addEventListener('activate', function(event) {
    var cacheWhitelist = [cacheName];

    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

this.addEventListener('fetch', function(event) {
    console.log('Handling fetch event for', event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                console.log('Found response in cache:', response);

                return response;
            }
            console.log('No response found in cache. About to fetch from network...');

            return fetch(event.request).then(function(response) {
                console.log('Response from network is:', response);

                return response;
            }).catch(function(error) {
                console.error('Fetching failed:', error);


                throw error;
            });
        })
    );
});
