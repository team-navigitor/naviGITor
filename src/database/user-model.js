const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema ({
    user: {type: String, required: true, unique: true},
    email: {type: String},
    password: {type: String, required: true}
})

//using ES5 due to binding issue using arrow function
userSchema.pre('save', function(next) {
    let userData = this;
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        bcrypt.hash(userData.password, salt, (err, hash) => {
            if (err) return console.error(err);
            userData.password = hash;
            next();
        })
    })
})

module.exports = mongoose.model('User', userSchema)