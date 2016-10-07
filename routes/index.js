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

	res.render("index", {
		showMenu: false
	});

});

router.post('/auth', function(req, res) {

	console.log(req.body);

	var user = {
		name: req.body.first_name,
		surname: req.body.last_name,
		id: req.body.vk_id,
		friends: req.body.friends_list 
	}

	user.friendsJSON = JSON.stringify(user.friends).replace(/'/g, "\\'");

	console.log(user);

	pool.getConnection(function(err, connection) {

		connection.query('SELECT * FROM records WHERE vk_id=' + user.id, function(err, rows, fields) {
		  	if (err) throw err;

		  	if (rows[0]) {
		  		// user already exists
		  		console.log("user exists--------------------------");

		  		connection.query('UPDATE records SET friends=\'' + user.friendsJSON + '\' WHERE vk_id=' + user.id, function(err, rows, fields) {
		  			if (err) console.log(err);
		  			connection.release();
		  			res.end("success, user updated");
		  			
		  		});
		  	} else {
		  		// new user
		  		console.log("new user--------------------------");

		  		connection.query('INSERT INTO records (vk_id, first_name, last_name, friends)' + 
		  			' VALUES (' + user.vk_id + ',' + user.first_name + ',' + user.last_name + ', \'' + user.friendsJSON + '\')',
		  			function(err, rows, fields) {
		  				if (err) console.log(err);
		  				connection.release();
		  				res.end("success, new user added");
		  				
		  		});
		  	}		  	
		});

	});

	

	

});

module.exports = router;