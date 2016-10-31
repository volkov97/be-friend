console.log('Started', self);

var CACHE_NAME = 'beFriendCache-v1';
var urlsToCache = [
    '/sw.js',
    '/',
    '/manifest.json',
    '/stylesheets/fonts.css',
    '/stylesheets/main.css',
    '/images/logo.png',
    '/images/friends.jpeg',
    '/images/mp-02.png',
    '/sounds/correct.wav',
    '/sounds/wrong.wav',
    '/sounds/finish.wav',
    '/javascripts/offline.js'
];

this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

this.addEventListener("fetch", function (event) {
    console.log("Request -->", event.request.url);

    //To tell browser to evaluate the result of event
    event.respondWith(
        caches.match(event.request) //To match current request with cached request it
            .then(function(response) {
                //If response found return it, else fetch again.
                return response || fetch(event.request);
            })
            .catch(function(error) {
                if (event.request.url.indexOf('/javascripts/require.js') != -1) {
                    return caches.match('/javascripts/offline.js');
                }
            })
    );
});