// Node Modules
const express = require('express');
const Joi = require("joi");

// Middlewares
const auth = require('../middleware/auth');
const authorization = require('../middleware/authorization');

// Models
const Product = require('../models/product');

// Router
const router = express.Router();


// ?Routes
// *HTTP Methods: GET, POST, PUT, DELETE
// GET Request |All Products| - SELECT Opreations
router.get("/", async (req, res, next) => {
    // You can use selected column by select() also  the .select() function is not mandatory
    // column_name: 1 => selected | fetch all selected ones
    // column_name: 0 => unselected | unselected ones are not fetched
    // You can use a condition like "find({column: value})" 
    // You can use a limit when fetching data like "limit(numberOfRecors)"

    try {
        const products = await Product.find({isActive: true})  
            .select({name: 1, price: 1, description: 1, imageUrl: 1})
            .populate("categoryId", "name -_id"); //for relations

        res.send(products)
    } catch (err) {
        next(err);
        console.error(err)
    }
})

// HTTP GET Request |One Product| - Filter - SELECT Opreations
router.get("/:productid", async (req, res) => {
    try {
        // const product = await Product.findOne({_id: req.params.productid}); // you can use this way or 
        const product = await Product.findById(req.params.productid) //this way
            .select({__v: 0, date: 0}); 

        res.send(product);
    } catch (err) {
        console.error(err);
        return res.status(404).send("Product not found")

    }
});

// HTTP POST Request - CREATE Opreations
router.post("/", auth, async (req,res, next) => {
    try {
        // Create validation rules
        const scheme = new Joi.object({
            name: Joi.string().min(3).max(60).required(),
            price: Joi.number().min(0).required(),
            description: Joi.string().min(5).max(255).required(),
            imageUrl: Joi.string().required(),
            isActive: Joi.boolean().required(),
            categoryId: Joi.string().required()
        });
    
        const result = scheme.validate(req.body);
    
        // If novalidate
        if (result.error) {
            return res.status(400).send(`${result.error.details[0].message}
                            Your value: ${result.error.details[0].context.value}
                            Your data type: ${typeof result.error.details[0].context.value}`);
        }
        
        // If validate
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            isActive: req.body.isActive,
            categoryId: req.body.categoryId
        });
        await product.save(); //mongoDB Save
    
        res.send(product)
        
    } catch (err) {
        next(err)
    }
});

// HTTP PUT Request - UPDATE Operations
router.put('/:productid', auth, async (req,res, next) => {
    try {
        // Create validation rules
        const scheme = new Joi.object({
            name: Joi.string().min(3).max(60),
            price: Joi.number().min(0),
            description: Joi.string().min(5).max(255),
            imageUrl: Joi.string(),
            isActive: Joi.boolean()
        });

        //? You can use direct update query
        /* const result = await Product.update({_id: req.params.productid}, {
            $set: {
                name: req.body.name,
            }
        }); */
        // ? or you can use findByIdAndUpdate
        /* const product = await Product.findByIdAndUpdate(req.params.productid, {
            $set: {
                name: req.body.name,
            }
        }, {new: true }); */

        const { error } = scheme.validate(req.body); //with object destructuring
        
        // If novalidate
        if (error) {
            return res.status(400).send(`${error.details[0].message}
            Your value: ${error.details[0].context.value}
            Your data type: ${typeof error.details[0].context.value}`);
        }

        //? Query First - find byID => save
        const product = await Product.findById(req.params.productid)
        

        // If validate save datas
        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;
        product.description = req.body.description || product.description;
        product.imageUrl = req.body.imageUrl || product.imageUrl;
        product.isActive = req.body.isActive || product.isActive;
        product.save();

   

    
        res.send(`Product has been saved!
                Name: ${product.name} 
                Price: ${product.price}
                Description: ${product.description}
                Image URL: ${product.imageUrl}
                Is Active: ${product.isActive}`);
        

    } catch (err) {
        console.error(err)
        next(err)
                
    }

});

// HTTP Delete Request - DELETE Operations
router.delete('/:productid', [auth, authorization], async (req,res) => {
    //returns result, deleted row count etc.
    // const result = await Product.deleteOne({_id: req.params.productid}); 

    try {
        // returns deleted data
        const product = await Product.findByIdAndDelete(req.params.productid);
        
        res.send(product);
    } catch (err) {
        console.error(err)
        return res.status(404).send("Product not found");
    }

});


module.exports=router;