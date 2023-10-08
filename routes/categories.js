// Node modules
const express = require('express');
const Joi = require('joi');

// Models
const Category = require('../models/category');

// Router
const router = express.Router();

// Routes
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({isActive: true})
            .select({name: 1});

        res.send(categories)
    } catch (err) {
        console.log(err)
    }
});

router.get('/:categoryid', async (req,res) => {
    try {
        const product = await Category.findById(req.params.categoryid)
            .select({__v: 0})
    
    
        res.send(product)
        
    } catch (err) {
        console.log(err);
        return res.status(404).send("Category not found")
    }
})

router.post('/', async (req, res) => {
    // validation rules
    const scheme = new Joi.object({
        name: Joi.string().min(3).max(60).required(),
        isActive: Joi.boolean().required()
    });

    const { error } = scheme.validate(req.body);
    // if no validate
    if (error) {
        return res.status(400).send(`${error.details[0].message}
                        Your value: ${error.details[0].context.value}
                        Your data type: ${typeof error.details[0].context.value}`);
    }

    const newCategory = new Category({
        name: req.body.name,
        isActive: req.body.isActive
    });
    await newCategory.save();

    res.send(newCategory)
})

router.put('/:categoryid', async (req, res) => {
    // validation rules
    const scheme = new Joi.object({
        name: Joi.string().min(3).max(60),
        isActive: Joi.boolean()
    });
    const { error } = scheme.validate(req.body);


    // If novalidate
    if (error) {
        return res.status(400).send(`${error.details[0].message}
        Your value: ${error.details[0].context.value}
        Your data type: ${typeof error.details[0].context.value}`);
    }

    try {
        const category = await Category.findByIdAndUpdate(req.params.categoryid, {
            $set: {name: req.body.name}
        }, {new: true}); 


        res.send(category)
        
    } catch (err) {
        console.log(err);
    }
});

router.delete('/:categoryid', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.categoryid);

        res.send(category)
        
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;