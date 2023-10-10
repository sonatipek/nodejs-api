// Node Modules
const jwt = require('jsonwebtoken');
const express = require('express');

module.exports = function (req, res, next) {
    const authToken = req.header("X-Auth-Token");
    
    // if token information is not sent
    if (!authToken) {
        return res.status(401).send("Access denied!");
    }
    
    // check if there is token information
    try {
        const decodedToken = jwt.verify(authToken, "jwtPrivateKey");

        req.user = decodedToken;
        next();

    } catch (err) {
        res.status(400).send("Incorrect token sent")
    }
}