const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectid = require('joi-objectid')(Joi)

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(5);
    return await bcrypt.hash(password, salt);
}

function validateUser(user) {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        isAdmin: Joi.boolean()
    }
    return Joi.validate(user, schema);
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});

userSchema.methods.generateToken = async function() {
    return await jwt.sign({
        _id: this._id,
        email: this.email,
        isAdmin: this.isAdmin
    }, config.get('password'))
}

const User = mongoose.model('User', userSchema);

mongoose.connect(config.get('db'), (err) => { 
    console.error(err);
}).then(
    () => console.log(`Connected to MongoDB ${config.get('db')}`)
);

async function addUser(user) {
    if (!user) {
        console.log('Creating User')
        user = {
            email: "aspiela@gmail.com",
            password: "zlehaslo",
            isAdmin: true
        }
    }
    console.log(user);
    const { error } = validateUser(user);
    if (error) {
        console.log('Validation Error')
        console.log(error.details[0].message);
        process.exit(1);
    }

    user = new User(user);

    var retVal = user;
    
    try {
        user =  await user.save()
    }
    catch (err) {
        console.log('User already exists');
        user = await User.findOne({ email: user.email }, (err, res) =>  {
            if(err) {
                console.error(err);
            }
            else {
                // console.log(res.generateToken());
                retVal = res;
            }
        })
    }
    return retVal.generateToken();
}

async function addAndShowUser() {
    console.log(
        await addUser({
            email: 'pawel@google.ie',
            password: await hashPassword('dupa'),
            isAdmin: false
        })
    )
}

addAndShowUser();