// Node Modules
const express = require('express');

// Router
const router = express.Router();

router.get("/", (req, res, next) => {
    try {
        res.send("Home Page");
        
    } catch (err) {
        next(err)
    }
});


module.exports = router;
