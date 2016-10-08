var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

	res.render("stats", {
		showMenu: true,
		menuActiveItem: "/stats"
	});

}); 

module.exports = router;