var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

	res.render("multiplayerGame", {
		message: "Multiplayer Game Page"
	});

});

module.exports = router;