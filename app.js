// Node Modules
const express = require('express');

// Custom Modules
const productRoutes = require('./routes/products');
const homeRoutes = require('./routes/home');

// Instance
const app = express();

// Middlewares
app.use(express.json()) //Read json objects

// Variables
const PORT = 3000;


// -Routes-
// Home Routes
app.use("/", homeRoutes);

// Product Routes
app.use("/api/products", productRoutes);


// Listen
app.listen(PORT, _ => {
    console.log("http://localhost:"+PORT);
})

module.exports = app;