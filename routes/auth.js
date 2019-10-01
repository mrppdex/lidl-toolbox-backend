const config = require('config');
const winston = require('winston');
require('winston-mongodb');

const bcrypt = require('bcrypt');
const express = require('express');
const { User, validateUser } = require('../models/user');

router = express.Router();

const winstonOptions = {
    db: config.get('db'),
    label: 'auth'
};

winston.add(new winston.transports.MongoDB(winstonOptions));

router.post('/', async (req, res) => {
    let user = req.body;
    const { err } = validateUser(user);
    if (err) {
        res.status(400).send(err.details[0].message);
    }
    user = await User.findOne({ email: user.email })
    if (!user) {
        winston.info(`Invalid user: ${req.body.email}`)
        return res.status(403).send('Invalid User or Password');
    }
    
    const passwordsMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordsMatch) {
        winston.info(`Wrong password. User: ${user.email}`)
        return res.status(403).send('Invalid User or Password');
    }

    winston.info(`Authorisation token sent to ${user.email}`);
    return res.send({ token: await user.generateToken()});

});

module.exports = router;
