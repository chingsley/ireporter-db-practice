/**eslint-disabled */
import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';

import app from '../../src/index';
// import pool from '../../server/db/config';
import { users, generateValidToken } from '../seed/seed';

chai.use(chaiHttp);

describe('PATCH interventions/:id/status ', () => {
    const { validUserOne, admin } = users;

    it('It should let an admin successfully update the status of a intervention', (done) => {
        chai.request(app)
            .patch('/api/v1/interventions/2/status') // records 1 and 3 are interventions, while 2 and 4 are interventions. So id's 1 and 3 will fail this test, while 2 and 4 will pass the test
            .set('x-auth', generateValidToken(admin))
            .send({ status: 'resolved' })
            .end((err, res) => {
                if (err) done(err);

                res.status.should.eql(200);
                res.body.should.be.an('object').which.has.keys(['status', 'data']);
                res.body.status.should.eql(200);
                res.body.data[0].id.should.eql(2);
                done();
            });
    });

    it('It should return 404 if the id does not match the type', (done) => {
        chai.request(app)
            .patch('/api/v1/interventions/1/status') // the record with id 1 is red-flag
            .set('x-auth', generateValidToken(admin))
            .send({ status: 'draft' })
            .end((err, res) => {
                if (err) done(err);

                res.status.should.eql(404);
                res.body.should.be.an('object').which.has.keys(['status', 'error']);
                res.body.status.should.eql(404);
                res.body.error.should.eql(`no intervention matches the specified id`);
                done();
            });
    });
});

describe('PATCH interventions/:id/location ', () => {
    const { validUserOne, validUserTwo } = users;

    it('It should let user successfully edit the location of a draft intervention', (done) => {
        chai.request(app)
            .patch('/api/v1/interventions/4/location') 
            .set('x-auth', generateValidToken(validUserTwo))
            .send({ location: '0.3344, -23.4454' })
            .end((err, res) => {
                if (err) done(err);

                res.status.should.eql(200);
                res.body.should.be.an('object').which.has.keys(['status', 'data']);
                res.body.status.should.eql(200);
                res.body.data[0].id.should.eql(4);
                done();
            });
    });

    it(`It should not allow change of location if status is not 'draft'`, (done) => {
        chai.request(app)
            .patch('/api/v1/interventions/2/location') // records 1 and 3 are interventions, while 2 and 4 are interventions. So id's 1 and 3 will pass this test, while 2 and 4 will fail the test
            .set('x-auth', generateValidToken(validUserOne))
            .send({ location: '0.3344, -23.4454' })
            .end((err, res) => {
                if (err) done(err);

                res.status.should.eql(403);
                res.body.should.be.an('object').which.has.keys(['status', 'error']);
                res.body.status.should.eql(403);
                res.body.error.should.eql(`The specified intervention cannot be edited because it is resolved`);
                done();
            });
    });
});


describe('PATCH interventions/:id/comment ', () => {
    const { validUserOne, validUserTwo } = users;

    it('It should let user successfully edit the comment of a draft intervention', (done) => {
        chai.request(app)
            .patch('/api/v1/interventions/4/comment') 
            .set('x-auth', generateValidToken(validUserTwo))
            .send({ comment: 'a valid comment provided' })
            .end((err, res) => {
                if (err) done(err);

                res.status.should.eql(200);
                res.body.should.be.an('object').which.has.keys(['status', 'data']);
                res.body.status.should.eql(200);
                res.body.data[0].id.should.eql(4);
                done();
            });
    });

    it(`It should not allow change of comment if status is not 'draft'`, (done) => {
        chai.request(app)
            .patch('/api/v1/interventions/2/comment') // records 1 and 3 are interventions, while 2 and 4 are interventions. So id's 1 and 3 will pass this test, while 2 and 4 will fail the test
            .set('x-auth', generateValidToken(validUserOne))
            .send({ comment: 'some comment provided here' })
            .end((err, res) => {
                if (err) done(err);

                res.status.should.eql(403);
                res.body.should.be.an('object').which.has.keys(['status', 'error']);
                res.body.status.should.eql(403);
                res.body.error.should.eql(`The specified intervention cannot be edited because it is resolved`);
                done();
            });
    });
});