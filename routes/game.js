var express = require('express');
var mysql = require('mysql');

var router = express.Router();
var pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

var game = {

    getTopListPOST: getTopListPOST,
    sendGameResultsPOST: sendGameResultsPOST,
    getStatisticsPOST: getStatisticsPOST,
    getNeighboursPOST: getNeighboursPOST,
    getTopList: getTopList,
    getLastGamesPOST: getLastGamesPOST
};

function getTopListPOST(req, res) {

    var num = req.body.number || 10;

    getTopList(num).then(
        function(result) {
            res.json(result);
        },
        function(error) {
            return console.log(error);
        }
    );
}

function sendGameResultsPOST(req, res) {

    var last_game = {};
    last_game.user_id = parseInt(req.body.user_id);
    last_game.score = parseInt(req.body.score);
    last_game.hits = parseInt(req.body.statistics.rightAnswers_count);
    last_game.misses = parseInt(req.body.statistics.mistakes_count);
    last_game.game_time = parseInt(req.body.statistics.game_time);
    last_game.first_try_hits = parseInt(req.body.statistics.firstTryRightAnswers_count);

    pool.getConnection(function(err, connection) {

        if(err) {
            throw err;
        }

        var sql = 'INSERT INTO games ' +
            'SET ?';
        connection.query(sql, last_game, function(error, result) {

            if (error) {
                throw error;
            }

            connection.release();
            res.end('success');
        });
    });
}

function getStatisticsPOST(req, res) {

    var vk_id = req.body.id;

    getStatistics(vk_id).then(
        function(result) {
            res.status(200);
            res.json(result);
        },
        function(error) {
            throw error;
        }
    );
}

function getNeighboursPOST(req, res) {

    var id = req.body.id;
    var num = req.body.num || 5;

    getNeighbours(num, id).then(
        function(result) {
            res.json(result);
        },
        function(error) {
            return console.log(error);
        }
    );
}

function getLastGamesPOST(req, res) {

    var id = req.body.id;
    var num = req.body.num;

    getLastGames(id, num).then(
        function(result) {
            res.json(result);
        },
        function(error) {
            return console.log(error);
        }
    );
}

function getTopList(num) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function (err, connection) {

            if (err) {
                reject('error');
                throw err;
            }
 
            var top_limit = parseInt(num);
            var sql = 'SELECT DISTINCT(r.vk_id), r.first_name, r.last_name, ' +
                '(SELECT MAX(score) FROM games WHERE user_id = r.id) AS max_score ' +
                'FROM records r ' +
                'INNER JOIN games g ON g.user_id = r.id ' +
                'ORDER BY max_score DESC ' +
                'LIMIT ?';
            connection.query(sql, top_limit,function (error, rows) {
                if (error) {
                    reject('error');
                    throw error;
                }

                connection.release();
                resolve(rows);
            });

        });
    });
}

function getNeighbours(num, user_id) {

    return new Promise(function(resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject('error');
                throw err;
            }

            var sql = 'SELECT DISTINCT(r.vk_id), r.first_name, r.last_name, r.id AS user_id, ' +
                '(SELECT MAX(score) FROM games WHERE user_id = r.id) AS max_score ' +
                'FROM records r ' +
                'INNER JOIN games g ON g.user_id = r.id ' +
                'ORDER BY max_score DESC';
            connection.query(sql,function (error, rows) {
                if (error) {
                    reject('error');
                    throw error;
                }

                var pos = -1;
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].user_id == user_id) {
                        pos = i;
                        break;
                    }
                }

                if (pos == -1) {
                    connection.release();
                    resolve({
                        userPos: -1,
                        list: -1
                    });
                    return;
                }

                var result = [];
                pos++;

                if (pos != -1) {
                    if (pos >= 1 && pos <= Math.floor(num / 2) + 1) {
                        result = rows.slice(0, num);

                        for (var i = 0; i < result.length; i++) {
                            result[i].realPos = i + 1;
                        }
                    } else if (pos >= rows.length - Math.floor(num / 2) && pos <= rows.length) {
                        result = rows.slice(rows.length - num);

                        for (var i = 0; i < result.length; i++) {
                            result[i].realPos = (rows.length - num + 1) + i;
                        }
                    } else {
                        result = rows.slice(pos - Math.floor(num / 2) - 1, pos + Math.floor(num / 2));

                        for (var i = 0; i < result.length; i++) {
                            result[i].realPos = (pos - Math.floor(num / 2)) + i;
                        }
                    }
                }

                connection.release();
                resolve({
                    userPos: pos,
                    list: result
                });
            });
        });
    });
}

function getStatistics(id) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject('error');
                throw err;
            }

            var sql = 'SELECT COUNT(*), SUM(score), SUM(hits), SUM(first_try_hits), SUM(misses), SUM(game_time), MAX(score) ' +
                'FROM games g ' +
                'WHERE g.user_id = ?';
            connection.query(sql, id, function (error, rows) {
                if (error) {
                    reject('error');
                    throw error;
                }

                connection.release();

                if (rows[0]['COUNT(*)'] == 0) {
                    rows[0]['SUM(score)'] = 0;
                    rows[0]['SUM(hits)'] = 0;
                    rows[0]['SUM(first_try_hits)'] = 0;
                    rows[0]['SUM(misses)'] = 0;
                    rows[0]['SUM(game_time)'] = 0;
                    rows[0]['MAX(score)'] = 0;
                }
                resolve(rows);
            });

        });
    });
}

function getLastGames(id, num) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject('error');
                throw err;
            }

            id = parseInt(id);
            num = parseInt(num);

            var sql = 'SELECT * ' +
                'FROM games g ' +
                'WHERE g.user_id = ? ' +
                'ORDER BY g.id DESC';
            connection.query(sql, id, function (error, rows) {
                if (error) {
                    reject('error');
                    throw error;
                }

                var obj = {
                    countOfGames: rows.length,
                    rows: rows.slice(0, num)
                }
                connection.release();
                resolve(obj);
            });

        });
    });
}

module.exports = game;