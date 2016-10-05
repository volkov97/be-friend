var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

	res.render("index", {
		message: "Welcome Page"
	});

}); 

module.exports = router;