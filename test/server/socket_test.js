import { server } from '../../server/server';
import io from 'socket.io-client';
import chai, { expect } from 'chai';
const should = chai.should();


// Testing for Socket.io connection
describe("Connects to the socket server", function () {
	// set up testing options
  const options = {
    transports: ['websocket'],
    'force new connection': true
  };

  it("echos message", function (done) {
    const client = io.connect("http://localhost:3000", options);

    client.once("echo", function (message) {
      message.should.equal("Hello World");
      done();
    });

    client.emit("echo", "Hello World");
  });
});