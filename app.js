// Node Modules
const express = require('express');
const Joi = require("joi");

// Instance
const app = express();

// Middlewares
app.use(express.json()) //Read json objects

// Variables
const PORT = 3000;

// Dummy Data
const products = [
    {id: 1, name: `iPhone 10`, price: 2000},
    {id: 2, name: `iPhone 11`, price: 4000},
    {id: 3, name: `iPhone 12`, price: 6000},
    {id: 4, name: `iPhone 13`, price: 8000},
    {id: 5, name: `iPhone 14`, price: 10000},

];


// Routes
// HTTP Methods: GET, POST, PUT, DELETE
app.get("/", (req, res) => {
    res.send("Home Page");
});

// GET Request
app.get("/api/products", (req, res) => {
    res.send(products)
})

// Get Request Filter
app.get("/api/products/:productid", (req, res) => {
    const product = products.find(productElem => productElem.id == req.params.productid);

    if (!product) {
        return res.status(404).send("Product Not Found");
    }
    res.send(product);
});

// Post Request
app.post("/api/products", (req,res) => {
    // Create validation rules
    const scheme = new Joi.object({
        name: Joi.string().min(3).max(60).required(),
        price: Joi.number().min(0).required()
    });

    const result = scheme.validate(req.body);

    // If novalidate
    if (result.error) {
        return res.status(400).send(`${result.error.details[0].message}
                        Your value: ${result.error.details[0].context.value}
                        Your data type: ${typeof result.error.details[0].context.value}`);
    }
    
    // If validate
    const product = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };

    products.push(product);

    res.send(product)
});

// Listen
app.listen(PORT, _ => {
    console.log("http://localhost:"+PORT);
})

module.exports = app;