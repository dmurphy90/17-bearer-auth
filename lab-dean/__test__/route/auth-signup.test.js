'use strict';

const server = require('../../lib/server.js');
const superagent = require('superagent');
const Auth = require('../../model/auth.js');
const faker = require('faker');
require('jest');

describe('POST /api/v1/signup', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(() => Promise.all([Auth.remove()]));
 
  describe('Valid request and response', () => {
    beforeAll(() => {
      return superagent.post(':4000/api/v1/signup')
        .send(new Auth({
          username: faker.name.firstName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        }))
        .then(res => this.response = res);
    });
    it('Should respond with a status code of 201', () => {
      expect(this.response.status).toBe(201);
    });
    it('Should create a new user with a username, email, and password', () => {
      console.log(this.response.request._data);
      expect(this.response.request._data).toHaveProperty('username');
      expect(this.response.request._data).toHaveProperty('email');
      expect(this.response.request._data).toHaveProperty('password');
    });
  
  });
  describe('Invalid request and response', () => {
    this.auth = {
      username: faker.name.firstName(),
      password: faker.hacker.phrase(),
      email: faker.internet.email(),
    };

    it('Should return a status 404 when given an invalid path', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/doesnotexist`)
        .send(this.auth)
        .catch(err => {
          expect(err.status).toBe(404);
        });
    });
    it('Should return a status 400 when handed a bad request', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/signup`)
        .send(new Auth({username: '', email: '', password: 123}))
        .catch(err => {
          expect(err.status).toBe(400);
        });
    });
  });
});