var express = require('express');
var jwt = require('jwt-simple');
var md5 = require('nodejs-md5');
var mysql = require('mysql');

var secret = require('../config/secret');

var router = express.Router();
var pool = mysql.createPool({
    host     : 'eu-cdbr-west-03.cleardb.net',
	user     : 'b1be4c963289de',
	password : '3235c7cf',
	database : 'heroku_f661a27bd3aac9d'
});

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

        var sql = 'SELECT * ' +
            'FROM records ' +
            'WHERE vk_id = ?';
        connection.query(sql, cur_user.vk_id, function(error, result) {

            if (error) {
                throw error;
            }

            if (result.length > 0) {

                // user exists - just response with his id
                var user = result[0];
                connection.release();

                var token = genToken(user.id);
                var token_title = 'hashToken';
                res.cookie(
                    token_title,
                    token,
                    {
                        expires: new Date(Date.now() + 0xFFFFFFF),
                        httpOnly: false
                    }
                );
                res.send({
                    user_id: user.id,
                    token: token
                });

            } else {

                // user not exists
                var sql = 'INSERT INTO records ' +
                    'SET ?';
                connection.query(sql, cur_user, function(error, result) {

                    if (error) {
                        throw error;
                    }
                    connection.release();

                    var token = genToken(result.insertId);
                    var token_title = 'hashToken';
                    res.cookie(
                        token_title,
                        token,
                        {
                            expires: new Date(Date.now() + 0xFFFFFFF),
                            httpOnly: false
                        }
                    );
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
    var token = jwt.encode(
        {
            exp: expires
        },
        secret.hash
    );

    return token;
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = user;