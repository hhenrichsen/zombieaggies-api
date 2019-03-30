process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/index');
const knex = require('../../src/db/connection');

describe('Route: Locations', () =>
{

    beforeEach(() =>
        knex.migrate.rollback()
            .then(() =>
                knex.migrate.latest())
            .then(() =>
                knex.seed.run()));

    afterEach(() =>
        knex.migrate.rollback());

    describe('GET /api/v1/locations', () =>
    {
        it('Should return all locations.', done =>
        {
            chai.request(server)
                .get('/api/v1/locations')
                .end((err, res) =>
                {
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
                    // key-value pair of {"data": [3 location objects]}
                    res.body.data.length.should.eql(6);
                    // the first object in the data array should
                    // have the right keys
                    res.body.data[0].should.include.keys(
                        'name', 'location', 'lat', 'long', 'owner', 'active'
                    );
                    done();
                });
        });
    });


    describe('GET /api/v1/locations/:id invalid input', () =>
    {
        it('Should throw an error if the location does not exist.', done =>
        {
            chai.request(server)
                .get('/api/v1/locations/-1')
                .end((err, res) =>
                {
                    // there should be a 404 status code
                    res.status.should.equal(404);
                    // the response should be JSON
                    res.type.should.equal('application/json');
                    // the JSON response body should have a
                    // key-value pair of {"status": "error"}
                    res.body.status.should.eql('Error');
                    // the JSON response body should have a
                    // key-value pair of {"message": "That location does not exist."}
                    res.body.message.should.eql('That location does not exist.');
                    done();
                });
        });
    });

    describe('GET /api/v1/locations/:id', () =>
    {
        it('Should respond with a single location.', done =>
        {
            chai.request(server)
                .get('/api/v1/locations/1')
                .end((err, res) =>
                {
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
                    // key-value pair of {"data": 1 location object}
                    res.body.data.should.include.keys(
                        'name', 'location', 'lat', 'long', 'owner', 'active'
                    );
                    done();
                });
        });
    });

    describe('GET /api/v1/locations/:id/small', () =>
    {
        it('Should respond with a single location with reduced data.', done =>
        {
            chai.request(server)
                .get('/api/v1/locations/1/small')
                .end((err, res) =>
                {
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
                    // key-value pair of {"data": 1 location object}
                    res.body.data.should.include.keys(
                        'id', 'owner', 'active'
                    );
                    done();
                });
        });
    });
});