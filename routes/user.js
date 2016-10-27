var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var md5 = require("nodejs-md5");
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

    var cur_user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        vk_id: req.body.vk_id
    };

    pool.getConnection(function(err, connection) {

        console.log(user);
        var sql = 'SELECT * ' +
            'FROM records ' +
            'WHERE vk_id = ?';
        connection.query(sql, cur_user.vk_id, function(err, result) {

            if (err) {
                throw err;
            }

            if (result.length > 0) {
                // user exists - just response with his id
                var user = result[0];

                connection.release();
                var token = genToken(user.id);
                var token_title = md5.string.quiet('hashToken');
                res.cookie(token_title, token, { expires: new Date(Date.now() + 0xFFFFFFF), httpOnly: false});
                res.send({
                    user_id: user.id,
                    token: token
                });
            } else {
                // user not exists

                var sql = 'INSERT INTO records ' +
                    'SET ?';
                connection.query(sql, cur_user, function(err, result) {

                    if (err) {
                        throw err;
                    }

                    connection.release();
                    var token = genToken(result.insertId);
                    var token_title = md5.string.quiet('hashToken');
                    res.cookie(token_title, token, { expires: new Date(Date.now() + 0xFFFFFFF), httpOnly: false});
                    res.send({
                        user_id: result.insertId,
                        token: token
                    });
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

    return token;
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = user;