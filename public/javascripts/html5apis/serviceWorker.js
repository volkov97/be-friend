define([],function(){var r={};return r.register=function(){if("serviceWorker"in navigator)return console.log("Service Worker is supported"),navigator.serviceWorker.register("sw.js").then(function(){return navigator.serviceWorker.ready}).then(function(r){console.log("Service Worker is ready :^)",r)}).catch(function(r){console.log("Service Worker error: ",r)}),!0},r});