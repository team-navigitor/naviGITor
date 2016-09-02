const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

//define user schema
const userSchema = new Schema ({
    user: {type: String, required: true, unique: true},
    email: {type: String},
    password: {type: String, required: true}
})

//create pre hook to hash password
//using ES5 due to binding issue using arrow function
userSchema.pre('save', function(next) {
    //save this as variable for use in bcrypt function
    let userData = this;
    //generate salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        //hash the password
        bcrypt.hash(userData.password, salt, (err, hash) => {
            if (err) return console.error(err);
            //set password to hashed password
            userData.password = hash;
            next();
        })
    })
})

module.exports = mongoose.model('User', userSchema)