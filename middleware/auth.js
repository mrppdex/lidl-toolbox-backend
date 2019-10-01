const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    const token = req.header('x-auth-token');
    const serverPassword = config.get('password');
    if (!token) {
        res.status(401).send('Authorisation Token not present.');
    }

    try {
        const decoded = jwt.verify(token, serverPassword);
        req.user = decoded;
        next()
    }
    catch (ex) {
        res.status(401).send('Token Invalid.');
    }
}