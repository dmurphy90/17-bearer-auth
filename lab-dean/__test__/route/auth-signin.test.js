'use strict';

const server = require('../../lib/server.js');
const superagent = require('superagent');
const mock = require('../lib/mocks.js');
require('jest');

describe('GET /api/v1/signin', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);


  describe('Valid request and response', () => {
    beforeAll(() => {
      return mock.auth.createOne()
        .then(data => {
          this.authData = data;
          return superagent.get(`:${process.env.PORT}/api/v1/signin`)
            .auth(this.authData.user.username, data.password)
            .then(res => this.response = res);
        });
    });
    it('Should return a status code of 200', () => {
      expect(this.response.status).toBe(200);
    });
    it('Should return a valid token', () => {
      expect(this.authData).toHaveProperty('token');
    });
  });
  describe('Invalid request and response', () => {
    it('Should return a status 400 when not provided a valid request body', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/signup`)
        .send({
          username: 'tim',
          password: 'timothy',
          email: 'hel@lo.com',
        })
        .then((res) => {
          this.response = res;
          return superagent.get(`:${process.env.PORT}/api/v1/signin`)
            .auth('tim', 'notmypassword')
            .catch(err => {
              this.errRes = err;
              expect(this.errRes.status).toEqual(401);
            });
        });
    });
    it('Should return a status 404 when given an invalid path', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/note`)
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});