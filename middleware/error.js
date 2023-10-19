module.exports = function(err, req,res, next) {
    // logging
    res.status(500).send("An unexpected error occurred!");
}