const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user-model.js')
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


UserController = {};

UserController.add = (req, res, next) => {
    let NewUser = new User({
        user: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    NewUser.save((err, req) => {
        if (err) {
            console.error('err: ', err)
            res.send('error!!!!')
        }
    });
}

UserController.verify = (req, res, next) => {
    if(!(req.body.name) || !(req.body.password)) {
        return;
    }
    User.findOne({'user': req.body.name}, 'password', (err, person) => {
        if (!(person)) res.send('User not found');
        else {
            const userPwd = req.body.password;
            const hashedPwd = person.password;
            bcrypt.compare(userPwd, hashedPwd, (err, result) => {
                if (result) {
                    next();
                } else console.log('invalid password')
            })
        }
    })
}

module.exports = UserController