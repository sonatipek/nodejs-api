// Node Modules
const express = require('express');

// Custom Modules
const productRoutes = require('./routes/products');
const homeRoutes = require('./routes/home');

// Instance
const app = express();

// Middlewares
app.use(express.json()) //Read json objects

// !You can use this code part for CORS or you can use 'cors' npm package
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*"); //? a.com, b.com or *(asterisk) = all
//     res.setHeader("Acces-Control-Allow-Methods", "*"); //? POST, GET etc. or *(asterisk) = All

//     next();
// });

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