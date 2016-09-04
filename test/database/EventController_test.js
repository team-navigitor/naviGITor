import Mocha from 'mocha';
import Chai, { expect } from 'chai';
import EventController from '../../src/database/event-controller.js'
import mongoose from 'mongoose';
var MONGO_URI = 'mongodb://navigitor:browncouch123@ds019826.mlab.com:19826/navigitor'
// var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
//                 replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };       
mongoose.connect(MONGO_URI);
mongoose.connection.on('connected', function() {console.log('event connected on mLab')})
mongoose.connection.on('error', function() {console.log('CONNECTION ERROR FROM TEST')})

describe("getting repo", function() {
    this.timeout(5000)
        
    })
    it("retrieves by repo", done => {
        let arg = {};
        arg.room = 'testrepo'
        EventController.getRepo(arg, (events) => {
            expect(events.length).to.be.above(1);
            done();
        })  
    })

    it('retrieves by time', function() {
        let arg = {}
        arg.time = 1454795924310;
        arg.room = 'testrepo';
        EventController.getByTime(arg, (events) => {
            expect(events.length).to.be.above(0);
            done()
        })
    })
