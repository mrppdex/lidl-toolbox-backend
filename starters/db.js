const mongoose = require('mongoose');
const config = require('config');


module.exports = function() {
    mongoose.connect(config.get('db'), (err) => { 
        console.error(err);
    }).then(
        () => console.log(`Connected to MongoDB ${config.get('db')}`)
    );
}