process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/index');
const knex = require('../../src/server/db/connection');

describe('Route: Teams', () => {

    beforeEach(() => {
        return knex.migrate.rollback()
            .then(() => { return knex.migrate.latest(); })
            .then(() => { return knex.seed.run(); });
    });

    afterEach(() => {
        return knex.migrate.rollback();
    });

    after(() => server.stop());

    describe('GET /api/v1/teams', () => {
        it('Should return all teams.', (done) => {
            chai.request(server)
                .get('/api/v1/teams')
                .end((err, res) => {
                    // there should be no errors
                    should.not.exist(err);
                    // there should be a 200 status code
                    res.status.should.equal(200);
                    // the response should be JSON
                    res.type.should.equal('application/json');
                    // the JSON response body should have a
                    // key-value pair of {"status": "success"}
                    res.body.status.should.eql('Success');
                    // the JSON response body should have a
                    // key-value pair of {"data": [3 team objects]}
                    res.body.data.length.should.eql(3);
                    // the first object in the data array should
                    // have the right keys
                    res.body.data[0].should.include.keys(
                        'id', 'name', 'color', 'points'
                    );
                    done();
                });
        });
    });


    describe('GET /api/v1/teams/:id invalid input', () => {
        it('Should throw an error if the team does not exist.', (done) => {
            chai.request(server)
                .get('/api/v1/teams/-1')
                .end((err, res) => {
                    // there should be a 404 status code
                    res.status.should.equal(404);
                    // the response should be JSON
                    res.type.should.equal('application/json');
                    // the JSON response body should have a
                    // key-value pair of {"status": "error"}
                    res.body.status.should.eql('Error');
                    // the JSON response body should have a
                    // key-value pair of {"message": "That team does not exist."}
                    res.body.message.should.eql('That team does not exist.');
                    done();
                });
        });
    });

    describe('GET /api/v1/teams/:id', () => {
        it('Should respond with a single team.', (done) => {
            chai.request(server)
                .get('/api/v1/teams/1')
                .end((err, res) => {
                    // there should be no errors
                    should.not.exist(err);
                    // there should be a 200 status code
                    res.status.should.equal(200);
                    // the response should be JSON
                    res.type.should.equal('application/json');
                    // the JSON response body should have a
                    // key-value pair of {"status": "success"}
                    res.body.status.should.eql('Success');
                    // the JSON response body should have a
                    // key-value pair of {"data": 1 team object}
                    res.body.data.should.include.keys(
                        'id', 'name', 'color', 'points'
                    );
                    done();
                });
        });
    });
});