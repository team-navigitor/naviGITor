const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    user: {type: String, required: true},
    data: {type: String, required: true},
    
});

const Event = mongoose.model('Event', eventSchema)

module.exports = Event;