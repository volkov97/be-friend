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
		vk_id: req.body.vk_id,
		friends: req.body.friends_list 
	};

	user.friendsJSON = JSON.stringify(user.friends).replace(/'/g, "\\'");

	console.log(user.friendsJSON);

	pool.getConnection(function(err, connection) {

		connection.query('SELECT * FROM records WHERE vk_id=' + user.vk_id, function(err, rows, fields) {
			if (err) throw err;

			if (rows[0]) {
				// user already exists

				connection.query('UPDATE records SET friends=\'' + user.friendsJSON + '\' WHERE vk_id=' + user.vk_id, function(err, rows, fields) {
					if (err) console.log(err);

					connection.release();
					res.end("success, user updated");
				});
			} else {
				// new user

				connection.query('INSERT INTO records (vk_id, first_name, last_name, friends)' +
					' VALUES (' + user.vk_id + ',  \'' + user.first_name + ' \',  \'' + user.last_name + ' \', \'' + user.friendsJSON + '\')', function(err, rows, fields) {
					if (err) console.log(err);

					connection.query('INSERT INTO statistics (vk_id) VALUES (' + user.vk_id + ')', function(err, rows, fields) {
						if (err) console.log(err);

						connection.release();
						res.end("success, new user added");
					});

				});
			}
		});

	});

});

router.post('/getFriends', function(req, res) {

	var searchedID = req.body.id;

	pool.getConnection(function(err, connection) {

		connection.query("SELECT friends FROM records WHERE vk_id=" + searchedID, function(err, rows, fields) {
			if (err) throw err;

			console.log(rows[0].friends);

			connection.release();
			res.end(JSON.stringify(rows[0].friends));
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

	var obj = req.body;

	pool.getConnection(function(err, connection) {

		connection.query("UPDATE statistics SET maxScore=IF(maxScore>" + obj.score + ", maxScore, " + obj.score + ") WHERE vk_id=" + obj.vk_id, function(err, rows, fields) {
			if (err) throw err;

			connection.release();
			res.end("success");
		});
	});

});

function getTopList(num) {
	return new Promise(function(resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				reject("error2");
				throw err;
			}

			connection.query('SELECT records.vk_id, records.first_name, records.last_name, statistics.maxScore FROM records, statistics WHERE records.vk_id=statistics.vk_id ORDER BY maxScore DESC LIMIT ' + num, function (err, rows, fields) {
				if (err) {
					reject("error1");
					throw err;
				}

				connection.release();
				resolve(rows);
			});

		});
	});
}

module.exports = router;