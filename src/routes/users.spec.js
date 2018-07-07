const request = require('supertest');
const app = require('../app');
const {Subject} = require('rxjs'); // to bridge (cleanly) between callbacks and blocking promises with await

const testUsers = require('../data/users');

describe('GET /users', () => {
  it('responds with json containing a list of users', done => {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer: X')
      .expect('Content-Type', /json/)
      .expect(res => {
        try {
          expect(res.body).toContain(expect.objectContaining({
            "name": "UserOne",
            "email": "userone@company1.com"
          }));
        } catch (assertion) {
          done.fail(assertion);
        }
      })
      .expect(200, done);
  });

  it('responds with 401 Unauthorized if Authorization token is empty string', done => {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer:')
      .expect('Content-Type', /json/)
      .expect(res => {
        try {
          expect(res.body).toEqual(expect.objectContaining({"error": "Unauthorized", "message": "Invalid token"}));
        } catch (assertion) {
          done.fail(assertion);
        }
      })
      .expect(401, done);
  });

  it('responds with 401 Unauthorized if Authorization Header is empty string', done => {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => {
        try {
          expect(res.body).toEqual(expect.objectContaining({"error": "Unauthorized", "message": "Invalid token"}));
        } catch (assertion) {
          done.fail(assertion);
        }
      })
      .expect(401, done);
  });

  it('responds with 429 Too Many Requests if client exceeds the configured limit', async done => {
    const {endpoints: {users: {capacity: {limit, interval} = {}} = {}}} = require('../config');
    const responses$ = new Subject();
    const usersRouter = require('../routes/users');
    usersRouter.limiter.rateLimiter.tokenBucket.content = 0;
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer: X')
      .expect('Content-Type', /json/)
      .expect(res => {
        try {
          expect(res.body).toEqual(expect.objectContaining({
            "code": "Provisioned rate exceeded", "message": expect.stringMatching(/Try again in .* seconds/), "unit": "seconds", "wait": expect.any(Number)
          }));
        } catch (assertion) {
          done.fail(assertion);
        }
      })
      .expect(401, done);
  });
});