var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

	res.render("index", {
		showMenu: false
	});

}); 

module.exports = router;