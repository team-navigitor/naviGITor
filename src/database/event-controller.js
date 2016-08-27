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
        arg.author = arg.data.substring(83, arg.data.indexOf('<') - 1)
        if (err) return console.error(err)
        let Event = mongoose.model(arg.room, eventSchema);
        let NewEvent = new Event();
        
        if (Array.isArray(arg.data)) {
            arg.data.forEach(elem => {
                NewEvent.user = elem.author;
                NewEvent.data = JSON.stringify(elem);
                Event.create(NewEvent)
                mongoose.connection.close()
            })
        } else {
            console.log('reached else. data: author: ' + arg.author + ' arg: ' + arg.data)
            NewEvent.user = arg.author,
            NewEvent.data = JSON.stringify(arg.data);
            Event.create(NewEvent);
            mongoose.connection.close()
        };
    })
}

EventController.getRepo = (arg, callback) => {
    mongoose.connect('mongodb://localhost/test', err => {
        if (err) return console.error(err);
        let coll = mongoose.model(arg.room + 's', eventSchema)
        coll.find((err, repo) => {
            if (err) return console.error(err)
            callback(repo)
            mongoose.connection.close()
        })
    })     
}

// EventController.getUser = (arg, callback) => {
//     mongoose.connect('mongodb://localhost/test', err => {
//         if (err) return console.error(err);
//         let coll = mongoose.model(arg.room + 's', eventSchema)
//         coll.findOne({'user': arg.user}, 'user data', (err, user) => {
//             if (err) return console.error(err)
//             callback(user);
//             mongoose.connection.close();
//         })
//     })
// }

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