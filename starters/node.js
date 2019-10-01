const config = require('config');

module.exports = function(app) {
    app.listen(config.get('nodePort'), () => console.log(`Node is listening on port ${config.get('nodePort')}`));
}

