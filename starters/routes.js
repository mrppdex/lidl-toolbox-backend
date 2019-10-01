const express = require('express');

const user = require('../routes/user');
const plu = require('../routes/plu');
const auth = require('../routes/auth');
const home = require('../routes/home');

module.exports = function(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/auth', auth);
    app.use('/api/plu', plu);
    app.use('/api/user', user);
    app.use('/', home);
}