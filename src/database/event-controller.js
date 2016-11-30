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

/**********************
 **** Event Schema ****
 **********************/

let eventSchema = new mongoose.Schema({
  user: {type: String, required: true},
  SHA: String,
  parent: [String],
  eventType: String,
  message: String,
  avatarUrl: String,
  time: Number,
  diff: String,
  diff_stats: {
    diff_adds: Number,
    diff_subs: Number
  }
});


/*************************
 ***** Event Methods *****
 *************************/

//initialize EventController as empty object
var EventController = {}

//create post method for EventController
EventController.saveEvent = function(arg) {
  let gitData = JSON.parse([arg.data]);
    //create Event model using room property passed from argument as the collection name
  let Event = mongoose.model(arg.room, eventSchema);
    var eventToAdd = new Event({
    user: gitData.user,
    SHA: gitData.SHA,
    parent: gitData.parent,
    eventType: gitData.eventType,
    message: gitData.message,
    time: parseInt(gitData.time),
    diff: gitData.diff,
    diffStats: {
      diffAdds: gitData.diffstats.adds,
      diffSubs: gitData.diffstats.subs
    }
    });
    eventToAdd.save(function(err){
      if(err) console.log('error saving in DB: ' + err)
    })
}

//fetch collection/repo
EventController.getRepo = (arg, callback) => {
    //define which collection we're looking for
    let coll = mongoose.model(arg.room + 's', eventSchema)
    //return all docs in collection
    coll.find((err, events) => {
        if (err) return console.error(err)
        callback(events);
    })
}

module.exports = EventController;
