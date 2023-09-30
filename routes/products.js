// Node Modules
const express = require('express');
const Joi = require("joi");

// Router
const router = express.Router();


// ?Routes
// *HTTP Methods: GET, POST, PUT, DELETE
// GET Request |All Products| - SELECT Opreations
router.get("/", (req, res) => {
    res.send(products)
})

// HTTP GET Request |One Product| - Filter - SELECT Opreations
router.get("/:productid", (req, res) => {
    const product = products.find(productElem => productElem.id == req.params.productid);

    if (!product) {
        return res.status(404).send("Product Not Found");
    }
    res.send(product);
});

// HTTP POST Request - CREATE Opreations
router.post("/", (req,res) => {
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

// HTTP PUT Request - UPDATE Operations
router.put('/:productid', (req,res) => {
    // Create validation rules
    const scheme = new Joi.object({
        name: Joi.string().min(3).max(60),
        price: Joi.number().min(0)
    });

    const product = products.find(productElem => productElem.id == req.params.productid);
    const { error } = scheme.validate(req.body); //with object destructuring

    // If product not found
    if (!product) {
        return res.status(404).send("Product not found");
    }

    // If novalidate
    if (error) {
        return res.status(400).send(`${error.details[0].message}
                        Your value: ${error.details[0].context.value}
                        Your data type: ${typeof error.details[0].context.value}`);
    }

    // If validate
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;

    res.send(`Product has been saved!
            New Name: ${product.name} 
            New Price: ${product.price}`);

})

// HTTP Delete Request - DELETE Operations
router.delete('/:productid', (req,res) => {
    const product = products.find(productElem => productElem.id == req.params.productid);

    if (!product) {
        return res.status(400).send('Procut not found');
    }

    const productIndex = products.indexOf(product);
    products.splice(productIndex, 1);

    res.send(product);
});


module.exports=router;