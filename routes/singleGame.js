var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

	res.render("singleGame", {
		message: "Single Game Page"
	});

});

module.exports = router;