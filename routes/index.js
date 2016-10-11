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

		var sql = 'SELECT * FROM records WHERE vk_id=?';
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

				var sql = 'INSERT INTO records(vk_id, first_name, last_name) VALUES (?, ?, ?)';
				connection.query(sql, [
					user.vk_id,
					user.first_name,
					user.last_name
				], function(err, result) {
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
	last_game.user_id = req.body.user_id;
	last_game.score = req.body.score;
	last_game.hits = req.body.statistics.rightAnswers_count;
	last_game.misses = req.body.statistics.mistakes_count;

	pool.getConnection(function(err, connection) {

		var sql = 'INSERT INTO games(user_id, score, hits, misses) ' +
			'VALUES(?, ?, ?, ?)';
		connection.query(sql,
			[
				last_game.user_id,
				last_game.score,
				last_game.hits,
				last_game.misses
			], function(err, rows, fields) {
			if (err) {
				throw err;
			}

			connection.release();
			res.end("success");
		});
	});

});

function getTopList(num) {
	return new Promise(function(resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				reject("error");
				throw err;
			}

			var sql = 'SELECT r.vk_id, r.first_name, r.last_name, ' +
				'(SELECT MAX(score) FROM games WHERE user_id = r.id) AS maxScore ' +
				'FROM records r ' +
				'INNER JOIN games g ON g.user_id = r.id ';
			// забыл про Limit и порядок выдачи
			// выдает несколько раз, если играл несколько раз - хотя может это норм?
			connection.query(sql, function (err, rows, fields) {
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

module.exports = router;