// Node modules
const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');

// Middlewares
const auth = require('../middleware/auth');
const authorization = require('../middleware/authorization');

// Models
const User = require('../models/user');

// Router
const router = express.Router();

// Routes
// api/users : GET
router.get('/', auth, async (req, res) => {
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

// api/users/:userid : PUT
router.put('/:userid', [auth, authorization], async (req,res) => {
    // validation rules
    const scheme = new Joi.object({
        isAdmin: Joi.boolean().required()
    });
    const { error } = scheme.validate(req.body);


    // If novalidate
    if (error) {
        return res.status(400).send(`${error.details[0].message}
        Your value: ${error.details[0].context.value}
        Your data type: ${typeof error.details[0].context.value}`);
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userid, {
            $set: {
                isAdmin: req.body.isAdmin
            }
        }, {new: true});

        res.send(updatedUser)
    } catch (err) {
        console.log(err)
    }
});

// api/user/:userid : DELETE
router.delete('/:userid', [auth, authorization], async (req,res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userid);

        res.send(deletedUser)
    } catch (err) {
        console.log(err)
    }
});

// api/users/create: POST (Register)
router.post('/create', async (req, res) => {
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

        //send token & response
        const token = newUser.createAuthToken(); 
        res.header("X-Auth-Token", token).send(newUser);//send token in header
    
    } catch (err) {
        console.log(err)
    }
});

// api/users/auth: POST (Login)
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
            //if auth is success, create token and send it
            const token = user.createAuthToken(); 
            res.header("X-Auth-Token", token).send(token) //send token in header

        } else {
            return res.status(400).send("Login failed, you entered your password incorrectly");
        }
        
    } catch (err) {
        console.log(err)
    }
});


module.exports = router;