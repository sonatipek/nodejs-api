const winston = require('../middleware/winston');

module.exports = function(err, req,res, next) {
    // logging
    winston.error(err.message);
    res.status(500).send("An unexpected error occurred!");
}