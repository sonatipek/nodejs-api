// Node Modules
const express = require('express');

// Router
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Home Page");
});


module.exports = router;
