const mongoose = require('mongoose');
//const Event = require('./event-model.js')
const Schema = mongoose.Schema;
mongoose.connection.once('open', () => {console.log('open on: mongodb://localhost/test')});
//mongoose.connect(('mongodb://localhost/test'))
//db.connect('mongodb://localhost/test');

const eventSchema = new Schema({
    user: {type: String, required: true},
    data: {type: String, required: true}, 
});

EventController = {}

EventController.post = arg => {
    mongoose.connect('mongodb://localhost/test', err => {
        if (err) return console.error(err)
        let Event = mongoose.model(arg.repo, eventSchema);
        let NewEvent = new Event();
        
        if (Array.isArray(arg.data)) {
            arg.data.forEach(elem => {
                NewEvent.user = elem.author;
                NewEvent.data = JSON.stringify(elem);
                Event.create(NewEvent)
            })
        } else {
            NewEvent.user = arg.author,
            NewEvent.data = JSON.stringify(arg.data);
            Event.create(NewEvent)
        };
    })    
}

    EventController.getRepo = (arg, callback) => {
        mongoose.connect('mongodb://localhost/test', err => {
            if (err) return console.error(err);
            let repo = arg.repo + 's';
            let coll = mongoose.model(arg.repo, eventSchema)
            coll.find((err, repo) => {
                if (err) return console.error(err)
                callback(repo)
            })
        })
    }

EventController.getUser = (arg, callback) => {
    mongoose.connect('mongodb://localhost/test', err => {
        if (err) return console.error(err);
        let coll = mongoose.model(arg.repo, eventSchema)
        coll.findOne({'user': arg.user}, 'user data', (err, user) => {
            if (err) return console.error(err)
            callback(user);
        })
    })
}

// EventController.getAllRepos = (arg, callback) => {
//     mongoose.connect('mongodb://localhost/test', err => {
//         if (err) return console.error(err);
//         const collArr = mongoose.connections[0];
//         // const allEvents = collArr.map(function(elem) {
//         //     return db[elem].find();
//         // });
//         // res.send(allEvents);
//         callback(collArr)
//     })
// }


module.exports = EventController;