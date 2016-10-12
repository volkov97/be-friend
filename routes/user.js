var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var mysql = require('mysql');
var pool = mysql.createPool({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b1c67bc0ce692d',
    password : '1f1be6ce',
    database : 'heroku_78e942bc13adfed'
});

var secret = require('../config/secret');

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
        connection.query(sql, user.vk_id, function(err, result) {

            if (err) {
                throw err;
            }

            var user = result[0];
            if (user) {
                // user exists - just response with his id

                connection.release();
                res.send(genToken(user.id));
            } else {
                // user not exists

                var sql = 'INSERT INTO records ' +
                    'SET ?';
                connection.query(sql, user, function(err, result) {

                    if (err) {
                        throw err;
                    }

                    connection.release();
                    res.send(genToken(result.insertId));
                });
            }
        });

    });
}

function genToken(user_id) {
    // 7 days
    var expires = expiresIn(7);
    var token = jwt.encode({
        exp: expires
    }, secret.hash);

    return {
        token: token,
        expires: expires,
        user_id: user_id
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = user;