var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b1c67bc0ce692d',
    password : '1f1be6ce',
    database : 'heroku_78e942bc13adfed'
});

var user = {

    vkAuthPOST: vkAuthPOST
}

function vkAuthPOST(req, res) {

    var user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        vk_id: req.body.vk_id
    };

    pool.getConnection(function(err, connection) {

        var sql = 'SELECT * ' +
            'FROM records ' +
            'WHERE vk_id = ?';
        connection.query(sql, [
            user.vk_id
        ], function(err, result) {
            if (err) throw err;

            if (result[0]) {
                // user exists - just response with his id

                connection.release();
                res.end(result[0].id.toString());
            } else {
                // user not exists

                var sql = 'INSERT INTO records ' +
                    'SET ?';
                connection.query(sql, user, function(err, result) {
                    if (err) throw err;

                    connection.release();
                    res.end(result.insertId.toString());
                });
            }
        });

    });
}

module.exports = user;