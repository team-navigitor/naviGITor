const mongoose = require('mongoose');
//const Event = require('./event-model.js')
const Schema = mongoose.Schema;
const db = mongoose.connection;
mongoose.connect('mongodb://localhost/test');

const eventSchema = new Schema({
    user: {type: String, required: true},
    data: {type: String, required: true}, 
});

EventController.post = arg => {
    db.once('open', () => {
    let Event = mongoose.model(req.repo, eventSchema);
    let NewEvent = new Event();
    //console.log(Event)
    if (Array.isArray(arg.data)) {
        arg.data.forEach(function(elem) {
            NewEvent.user = elem.author;
            NewEvent.data = JSON.stringify(elem);
            Event.create(NewEvent)
        })
    } else {
        NewEvent.user = arg.data.author,
        NewEvent.data = JSON.stringify(arg.data);
        Event.create(NewEvent)
        };
    })
}

EventController.getRepo = arg => {
    db.once('open', () => {
        var repo = arg.reqo.toLowerCase() + 's'
        res.send(db[req.repo].find())
    })
}

EventController.getUser = arg => {
    db.once('open', () => {
        res.send((db[arg.repo].find({ user: req.user})))
    })
}

EventController.getAllRepos = arg => {
    db.once('open', () => {
        const collArr = db.listCollections();
        const allEvents = collArr.map(function(elem) {
            return db[elem].find();
        });
        res.send(allEvents);
    })
}

module.exports = EventController;