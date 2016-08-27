const mongoose = require('mongoose');
//const Event = require('./event-model.js')
const Schema = mongoose.Schema;
mongoose.connection.once('open', function() {console.log('open on: mongodb://localhost/test')});
//mongoose.connect(('mongodb://localhost/test'))
//db.connect('mongodb://localhost/test');

const eventSchema = new Schema({
    user: {type: String, required: true},
    data: {type: String, required: true}, 
});

EventController = {}
EventController.post = (arg) => {
    mongoose.connect('mongodb://localhost/test', function(err) {
        if (err) return console.error(err)
    let Event = mongoose.model(arg.repo, eventSchema);
    console.log('event: ', Event)
    let NewEvent = new Event();
    
    if (Array.isArray(arg.data)) {
        arg.data.forEach(function(elem) {
            NewEvent.user = elem.author;
            NewEvent.data = JSON.stringify(elem);
            Event.create(NewEvent)
        })
    } else {
        console.log('into else')
        NewEvent.user = arg.author,
        NewEvent.data = JSON.stringify(arg.data);
        console.log(NewEvent)
        Event.create(NewEvent)
        console.log('collections:', mongoose.connection.db.collections(function(err, data) {
            console.log(data)
        }))
        };
    })
    
}

    EventController.getRepo = arg => {
        mongoose.connect('mongodb://localhost/test', function(err) {
        var repo = arg.room.toLowerCase() + 's';
        var coll = mongoose.connection.db.listCollections();
        //console.log('coll:', coll)
        //console.log(coll);
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