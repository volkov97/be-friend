define(['jquery'], function($) {

    var db = {};

    db.authUser = function(obj) {
        $.post("/auth", obj, function(data) {
            console.log(data);
        }, "json");
    };

    db.sendGameResults = function(obj, callback) {
        return new Promise(function(resolve, reject) {
            $.post("/sendGameResults", obj, function(data) {
                console.log(data);
                resolve(data);
            });
        })
    };

    return db;

});