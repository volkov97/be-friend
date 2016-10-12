var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
	host     : 'us-cdbr-iron-east-04.cleardb.net',
	user     : 'b1c67bc0ce692d',
	password : '1f1be6ce',
	database : 'heroku_78e942bc13adfed'
});

router.get('/', function(req, res) {

	getTopList(10).then(
		function(result) {

			res.render("index", {
				title: "beFriend",
				topList: result
			});

		},
		function(error) {
			console.log(error);
		}
	);

});

router.post('/auth', function(req, res) {

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

});

router.post('/getTopList', function(req, res) {

	var num = req.body.number || 10;

	getTopList(num).then(
		function(result) {
			res.json(result);
		},
		function(error) {
			console.log(error);
		}
	);

});

router.post('/sendGameResults', function(req, res) {

	var last_game = {};
	last_game.user_id = parseInt(req.body.user_id);
	last_game.score = parseInt(req.body.score);
	last_game.hits = parseInt(req.body.statistics.rightAnswers_count);
	last_game.misses = parseInt(req.body.statistics.mistakes_count);
	last_game.game_time = parseInt(req.body.statistics.game_time);

	pool.getConnection(function(err, connection) {

		var sql = 'INSERT INTO games ' +
			'SET ?';
		connection.query(sql, last_game, function(err, result) {
			if (err) {
				throw err;
			}

			connection.release();
			res.end("success");
		});
	});

});

router.post('/getStatistics', function(req, res){

	var vk_id = req.body.id;

	getStatistics(vk_id).then(
		function(result) {
			res.json(result);
		},
		function(error) {
			console.log(error);
		}
	);
});

router.post('/getNeighbours', function(req, res) {

	var id = req.body.id;
	var num = req.body.num || 5;

	getNeighbours(num, id).then(
		function(result){
			res.json(result);
		},
		function(error){
			console.log(error);
		}
	);

});

function getTopList(num) {
	return new Promise(function(resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				reject("error");
				throw err;
			}

            var top_limit = parseInt(num);
			var sql = 'SELECT DISTINCT(r.vk_id), r.first_name, r.last_name, ' +
				'(SELECT MAX(score) FROM games WHERE user_id = r.id) AS max_score ' +
				'FROM records r ' +
				'INNER JOIN games g ON g.user_id = r.id ' +
                'ORDER BY max_score DESC ' +
                'LIMIT ?';
			// забыл про Limit и порядок выдачи
			// выдает несколько раз, если играл несколько раз - хотя может это норм?
			connection.query(sql, top_limit,function (err, rows) {
				if (err) {
					reject("error");
					throw err;
				}

				connection.release();
				resolve(rows);
			});

		});
	});
}

function getNeighbours(num, user_id){

	return new Promise(function(resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				reject("error");
				throw err;
			}

			var sql = 'SELECT DISTINCT(r.vk_id), r.first_name, r.last_name, r.id AS user_id, ' +
				'(SELECT MAX(score) FROM games WHERE user_id = r.id) AS max_score ' +
				'FROM records r ' +
				'INNER JOIN games g ON g.user_id = r.id ' +
				'ORDER BY max_score DESC';
			connection.query(sql,function (err, rows) {
				if (err) {
					reject("error");
					throw err;
				}

				console.log("NEIGHBOURS");


				var pos = -1;
				for (var i = 0; i < rows.length; i++) {
					if (rows[i].user_id == user_id){
						pos = i;
						console.log("FOUND " + pos);
						break;
					}
				}

				var result = [];
				pos++;

				if (pos != -1) {
					if (pos >= 1 && pos <= Math.floor(num / 2) + 1){
						console.log("1");
						result = rows.slice(0, num);

						for (var i = 0; i < num; i++) {
							result[i].realPos = i + 1;
						}
					} else if (pos >= rows.length - Math.floor(num / 2) && pos <= rows.length){
						console.log("2");
						result = rows.slice(rows.length - num);

						for (var i = 0; i < num; i++) {
							result[i].realPos = (rows.length - num + 1) + i;
						}
					} else {
						console.log("3");
						result = rows.slice(pos - Math.floor(num / 2) - 1, pos + Math.floor(num / 2));

						for (var i = 0; i < num; i++) {
							result[i].realPos = (pos - Math.floor(num / 2)) + i;
						}
					}
				}

				console.log(result);

				connection.release();
				resolve({
					userPos: pos,
					list: result
				});
			});
		});
	});
}

function getStatistics(id){
	return new Promise(function(resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				reject("error");
				throw err;
			}

			var sql = 'SELECT COUNT(*), SUM(score), SUM(hits), SUM(misses), SUM(game_time), MAX(score) ' + 
			'FROM games g ' +
			'WHERE g.user_id = ?';
			connection.query(sql, id, function (err, rows) {
				if (err) {
					reject("error");
					throw err;
				}

				connection.release();

				if (rows[0]['COUNT(*)'] == 0){
					rows[0]['SUM(score)'] = 0;
					rows[0]['SUM(hits)'] = 0;
					rows[0]['SUM(misses)'] = 0;
					rows[0]['SUM(game_time)'] = 0;
					rows[0]['MAX(score)'] = 0;
				}
				resolve(rows);
			});

		});
	});
}

module.exports = router;