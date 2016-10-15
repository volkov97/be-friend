var jwt = require('jwt-simple');
var user = require('../routes/user');
var secret = require('../config/secret');

module.exports = function(req, res, next) {

    var token = (req.body && req.body.access_token)
        || (req.query && req.query.access_token)
        || req.headers['x-access-token'];

    if (token) {

            var decoded = jwt.decode(token, secret.hash);
            if (decoded.exp <= Date.now()) {

                res.status(400);
                res.json({
                    "status": 400,
                    "message": "Access token expired"
                });
                return;
            }

            next();

    } else {

        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid access token"
        });
        return;
    }
}