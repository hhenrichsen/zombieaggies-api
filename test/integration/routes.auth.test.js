process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');

const server = require('../../build/src/server/index');
const knex = require('../../src/db/connection');
const queries = require('../../src/db/queries/users');

const user = { username: 'sevro.boyo@gmail.com',
    password:
     '$2a$10$yv/g70t/dXu2SDNfooPguuj63jjPSejulwmGwrscFrKsvJn3uSdya',
    firstname: 'Sevro',
    lastname: 'Boyo',
    phone: '',
    aNumber: 'A00000000',
    title: 'Player',
    active: true,
    bandanna: false,
    id: 6,
    createdAt: new Date('2019-09-15T23:56:31.682Z'),
    updatedAt: new Date('2019-09-15T23:56:31.682Z'),
    team: 1,
    tags: 0,
    lastFeed: null,
    dead: false,
    discord: null,
    nickname: null }

describe('Route: Auth', () =>
{

    beforeEach(() => 
    {
        // this.query = sinon.stub(queries, 'addUser').resolves();
        knex.migrate.rollback()
            .then(() =>
                knex.migrate.latest())
            .then(() =>
                knex.seed.run())
            });

    afterEach(() => 
    {
        // this.query.restore();
        knex.migrate.rollback();
    });

    describe('GET /auth/register', () =>
    {
        it('should render the register view', done =>
        {
            chai.request(server)
                .get('/auth/register')
                .end((err, res) =>
                {
                    should.not.exist(err);
                    res.redirects.length.should.eql(0);
                    res.status.should.eql(200);
                    res.type.should.eql('text/html');
                    res.text.should.contain('<h2>Register</h2>');
                    res.text.should.contain(
                        '<p><button type="submit">Register</button></p>');
                    done();
                });
        }).timeout(5000);
    });

    describe('POST /auth/register', () =>
    {
        it('should register a new user', done =>
        {
            chai.request(server)
                .post('/auth/register')
                .send({
                    username: 'michael.herman@gmail.com',
                    firstname: 'Michael',
                    lastname: 'Herman',
                    password: 'michael2',
                    aNumber: 'A00000002',
                    phone: '1234567890',
                })
                .end((err, res) =>
                {
                    should.not.exist(err);
                    res.redirects[0].should.contain('/start');
                    done();
                });
        }).timeout(5000);
    });

    describe('POST /auth/register No Phone', () =>
    {
        it('should register a new user without a phone', done =>
        {
            chai.request(server)
                .post('/auth/register')
                .send({
                    username: 'stephen.herman@gmail.com',
                    firstname: 'Stephen',
                    lastname: 'Herman',
                    password: 'stephen2',
                    aNumber: 'A00000003',
                })
                .end((err, res) =>
                {
                    should.not.exist(err);
                    res.redirects[0].should.contain('/start');
                    done();
                });
        });
    });

    describe('GET /auth/login', () =>
    {
        it('should render the login view', done =>
        {
            chai.request(server)
                .get('/auth/login')
                .end((err, res) =>
                {
                    should.not.exist(err);
                    res.redirects.length.should.eql(0);
                    res.status.should.eql(200);
                    res.type.should.eql('text/html');
                    res.text.should.contain('<h2>Login</h2>');
                    res.text.should.contain(
                        '<p><button type="submit">Login</button></p>');
                    done();
                });
        });
    });

    describe('POST /auth/login', () =>
    {
        it('should login a user', done =>
        {
            chai.request(server)
                .post('/auth/login')
                .send({
                    username: 'jjohnson@gmail.com',
                    password: 'johnson',
                })
                .end((err, res) =>
                {
                    res.redirects[0].should.contain('/auth/status');
                    done();
                });
        });
    });

});
