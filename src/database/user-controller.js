const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user-model.js')
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
var MONGO_URI = 'mongodb://navigitor:browncouch123@ds019826.mlab.com:19826/navigitor'
// var MONGO_URI = 'mongodb://localhost/navigitor'
mongoose.connect(MONGO_URI);
mongoose.connection.on('connected', function() {console.log('user connected on mLab')})
mongoose.connection.on('error', function(e) {console.log('CONNECTION ERROR FROM USER: ' + e)})

//initialize UserController as empty object
let UserController = {};

//create method to add user to collection
UserController.add = (req, res, next) => {
    //initialize new instance of user
    let NewUser = new User({
        user: req.body.username,
        email: req.body.email,
        password: req.body.password,
        team: req.body.team,
        github: req.body.github
    });
    //save NewUser to collection
    NewUser.save((err, req) => {
        if (err) {
            console.error('err: ', err)
            // res.send('error!!!!')
        }
    });
}

//create method to verify user
UserController.verify = (req, callback) => {
    console.log('verify firing', req.body)
    //make sure needed info is included
    let verUser;
    if(!(req.body.name) || !(req.body.password)) {
        veruser = false;
        console.log('verUser: ', verUser)
        return verUser;
    }
    //find user in collection
    User.findOne({'user': req.body.name}, 'password', (err, person) => {
        console.log('finding firing')
        //if user not found
        if (!(person)) {
            verUser = false;
            console.log('no person found')
            callback(verUser)
        }
        else {
            //get password from req
            const userPwd = req.body.password;
            //get password from user found in collection
            const hashedPwd = person.password;
            //verify passwords match
            bcrypt.compare(userPwd, hashedPwd, (err, result) => {
                if (result) {
                    verUser = true;
                    if (person.github) callback({person: person.github})
                    else (callback(verUser))
                } else {
                    console.log('invalid password');
                    verUser = false;
                    callback(verUser)
                }
            });
        }
    });
}

module.exports = UserController
