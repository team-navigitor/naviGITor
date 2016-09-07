const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// mongoose.connect('mongodb://ec2-54-152-1-18.compute-1.amazonaws.com');
var MONGO_URI = 'mongodb://navigitor:browncouch123@ds019826.mlab.com:19826/navigitor'
// var MONGO_URI = 'mongodb://localhost/test'
// var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
//                 replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
mongoose.connect(MONGO_URI);
mongoose.connection.on('connected', function() {console.log('event connected on mLab')})
mongoose.connection.on('error', function(e) {console.log('CONNECTION ERROR FROM EVENT: ' + e)})

let eventSchema = new mongoose.Schema({
  user: {type: String, required: true},
  SHA: String,
  parent: [String],
  eventType: String,
  message: String,
  time: String
});

//initialize EventController as empty object
var EventController = {}

//create post method for EventController
EventController.saveEvent = function(arg) {
  let gitData = JSON.parse([arg.data]);
  console.log('author from db' + gitData.author)
    //create Event model using room property passed from argument as the collection name
    let Event = mongoose.model(arg.room, eventSchema);
    //create new instance of event
    //let eventToAdd = new Event();
    //check if data is coming in as array, which will only happen if a new user
    //with prior history in Git tree joins team
    // if (Array.isArray(arg.data)) {
    //     //iterate through array, adding each
    //     arg.data.forEach(elem => {
    //         //parse user from each element in array
    //         //eventToAdd.user = elem.data.substring(83, elem.data.indexOf('<') - 1);
    //         //eventToAdd.time = elem.data.substring(elem.data.indexOf('>') + 1, elem.data.indexOf('>') + 12);
    //         //eventToAdd.data = JSON.stringify(elem);
    //
    //         //save event to collection or create new collection
    //         //Event.create(eventToAdd)
    //       eventToAdd.save(function(err){
    //         if(err) console.log('error saving in DB: ' + err)
    //       })
    //     })
    // //else if a single instance of Git event
    // } else {
      var eventToAdd = new Event({
      user: gitData.author,
      SHA: gitData.SHA,
      parent: gitData.parent,
      eventType: gitData.event,
      message: gitData.message,
      time: gitData.time
      });
        console.log('newevent: ', eventToAdd)
        //save event to collection or create new collection
        //Event.create(eventToAdd);
        eventToAdd.save(function(err){
          if(err) console.log('error saving in DB: ' + err)
        })
  //  };
}

//fetch collection/repo
EventController.getRepo = (arg, callback) => {
    //define which collection we're looking for

    let coll = mongoose.model(arg.room + 's', eventSchema)
    //console.log(coll)
    //return all docs in collection
    coll.find((err, events) => {
        if (err) return console.error(err)
        callback(events);
    })
}

EventController.getByTime = (arg, callback) => {
    let time = Math.floor(arg.time / 1000)

    let coll = mongoose.model(arg.room + 's', eventSchema)
    coll.find({time: {$gt: time}}, 'user data time', (err, data) => {
        if (err) console.log('getByTime error: ', err)
        callback(data)
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
// const test = {
//     room: 'testrepo',
//     data: '"19cbd65fba1ba345fc927395d572830162f7b1cf 5e860081d9f7ccc7cbc0a64922beed6d6ac09de9 Colin Brownlie <colin@Colins-MacBook-Pro.local> 1472261199 -0700     \\tcommit (merge): fixing merge conflict"'
// }
// EventController.post(test)

module.exports = EventController;
