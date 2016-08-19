import { server } from '../../server/server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
const should = chai.should();

chai.use(chaiHttp);

// Test the GET /. route
// describe('/GET data', () => {
//   it('should connect to root route', (done) => {
//     chai.request('http://localhost:3000')
// 	    .get('/')
// 	    .end((err, res) => {
// 		    	expect(err).to.be.null;
// 	        expect(res).to.have.status(303);
// 	        expect(res.body).to.equal('hello');
// 	      done();
// 	    });
//   });
// });