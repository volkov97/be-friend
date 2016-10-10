define(['jquery'], function($) {

    var db = {};

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