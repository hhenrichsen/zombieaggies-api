process.env.NODE_ENV = 'test';

const chai = require('chai');

describe('Sample Test', () => {
    it('Should pass.', (done) => {
        const sum = 1 + 2;
        sum.should.eql(3);
        sum.should.not.eql(4);
        done();
    });
});