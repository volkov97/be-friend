var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
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
		surname:
	}

	connection.connect();

	connection.query('SELECT * FROM records WHERE id=1702', function(err, rows, fields) {
	  	if (err) throw err;

	  	console.log('The solution is: ', rows[0]);

	 	res.end("success");
	});

	connection.end();

});

module.exports = router;