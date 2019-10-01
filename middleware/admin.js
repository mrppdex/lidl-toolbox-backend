module.exports = function(req, res, next) {
    if ( ['admin', 'master'].includes(req.user.role) ) {
        next();
    } else {
        res.status(403).send('No authorisation.');
    }
}