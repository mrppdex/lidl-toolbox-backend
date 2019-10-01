// const fs = require('fs');
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());

require('./starters/db')();
require('./starters/node')(app);
require('./starters/routes')(app);




// var https = require('https');
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};




// const password = config.get("password");

// async function generateToken() {
//     const salt = await bcrypt.genSalt(5);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     return await jwt.sign({
//         name: "Pawel", 
//         password: hashedPassword
//     }, password);
// };

// app.get('/', async (req, res) => {
//     const token = await generateToken();
//     console.log("receiveg GET request");
//     res.set('Access-Control-Allow-Origin', '*');
//     res.send({headers: req.header("host"), data: token});
// });

// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(port, () => console.log("I'm listening..."));
