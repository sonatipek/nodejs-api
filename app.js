// Node Modules
const express = require('express');

// Instance
const app = express();

// Variables
const PORT = 3000;

// Routes
// HTTP Methods: GET, POST, PUT, DELETE
app.get("/", (req, res) => {
    res.send("Home Page");
})

// Listen
app.listen(PORT, _ => {
    console.log("http://localhost:"+PORT);
})

module.exports = app;