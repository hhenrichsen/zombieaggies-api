process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/index');

describe('Route: Index', () => {

    describe('GET /', () => {
        it('Should return HTML.', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    // there should be no errors
                    should.not.exist(err);
                    // there should be a 200 status code
                    res.status.should.equal(200);
                    // the response should be HTML.
                    res.type.should.equal('text/html');
                    done();
                });
        });
    });
    after(() => server.stop());
});