const express = require('express');

const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router = express.Router()

router.get('/', [auth, admin], async (req, res) => {
    res.send(await User.find({}).select('email role store'));
})

router.delete('/:id', async (req, res) => {
    let user;
    try {
        user = await User.findByIdAndDelete(req.params.id);
    } catch (err) {
        res.status(400).send(err)
    } finally {
        res.send(user);
    }
})

router.post('/', [auth, admin], async (req, res) => {
    let user = req.body;
    const { error } = validateUser(user);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    if (user.password !== '') {
        tmpUser = new User(user);
        await tmpUser.hashPassword();
        user.password = tmpUser.password;    
    } else {
        delete user.password;
    }
    await User.findOneAndUpdate({ email: user.email }, user, {new: true}, async (err, nuser) => {
        if (err) {
            return res.status(500).send(err);
        } else if (!nuser) {
            user = new User(user);
            await user.hashPassword();
            try {
                await user.save();
            } catch (err) {
                return res.status(500).send(err);
            }
            return res.send({ user });
        } else {
            return res.send({ nuser });
        }
    })

    // let user = req.body;

    // const { error } = validateUser(user);
    // if (error) {
    //     return res.status(400).send(error.details[0].message);
    // }
    // user = new User(user);
    // await user.hashPassword();

    // try {
    //     await user.save();
    // } catch (err) {
    //     console.log(err);
    //     return res.status(500).send(err.errmsg);
    // }

    // res.send({ user });

    

})

module.exports = router;