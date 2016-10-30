var express = require('express');
var mysql = require('mysql');

var user = require('./user.js');
var game = require('./game.js');

var router = express.Router();
var pool = mysql.createPool({
	host     : 'us-cdbr-iron-east-04.cleardb.net',
	user     : 'b1c67bc0ce692d',
	password : '1f1be6ce',
	database : 'heroku_78e942bc13adfed'
});

router.get('/', function(req, res) {

	game.getTopList(10).then(
		function(result) {
			res.render('index', {
				title: 'beFriend | Узнай, на сколько хорошо ты знаешь своих друзей!',
				topList: result
			});
		},
		function(error) {
			return console.log(error);
		}
	);

});

router.post('/auth', user.vkAuthPOST);

router.post('/getTopList', game.getTopListPOST);
router.post('/vl/sendGameResults', game.sendGameResultsPOST);
router.post('/vl/getStatistics', game.getStatisticsPOST);
router.post('/vl/getNeighbours', game.getNeighboursPOST);
router.post('/vl/getLastGames', game.getLastGamesPOST);

module.exports = router;