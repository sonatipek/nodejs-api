// Node modules
const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');

// Models
const User = require('../models/user');

// Router
const router = express.Router();

// Routes
// api/users : GET
router.get('/', async (req, res) => {
    try {
        const user = await User.find();

        if (user.length <= 0) {
            return res.status(400).send("No user records have been added")
        }

        res.send(user)
    } catch (err) {
        console.log(err);
    }
})

// api/user: POST
router.post('/', async (req, res) => {
    // Create validation rules
    const scheme = new Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(255).required(),
    });
    
    // If novalidate
    const { error } = scheme.validate(req.body);
    if (error) {
        return res.status(400).send(`${error.details[0].message}
                        Your value: ${error.details[0].context.value}
                        Your data type: ${typeof error.details[0].context.value}`);
    }
    
    // If validate
    try {
        // Email Control
        const user = await User.findOne({email: req.body.email});
        if (user) {
            return res.status(400).send("This email was previously registered with")
        }

        //save the password after encrypting it in the database
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 

        //save the database
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save(); //mongoDB Save

        //send response
        res.send(newUser)
    } catch (err) {
        console.log(err)
    }
});

// api/user/auth: POST
router.post('/auth', async (req,res) => {
    // Create validation rules
    const scheme = new Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    
    // If novalidate
    const { error } = scheme.validate(req.body);
    if (error) {
        return res.status(400).send(`${error.details[0].message}
                        Your value: ${error.details[0].context.value}
                        Your data type: ${typeof error.details[0].context.value}`);
    }

    // If validate
    try {
        // Check email
        const user = await User.findOne({email: req.body.email});

        // If email not found
        if (!user) {
            return res.status(400).send("No user registered with this email was found");
        }
        
        // If email found, check password
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send("Login successful")

        } else {
            return res.status(400).send("Login failed, you entered your password incorrectly");
        }
        
    } catch (err) {
        console.log(err)
    }
});


module.exports = router;