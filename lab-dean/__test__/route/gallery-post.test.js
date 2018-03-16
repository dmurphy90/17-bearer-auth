'use strict';

const faker = require('faker');
const mock = require('../lib/mocks.js');
const superagent = require('superagent');
const server = require('../../lib/server.js');
require('jest');

describe('POST /api/v1/gallery', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);

  beforeAll(() => mock.auth.createOne().then(data => this.mockUser = data));

  describe('Valid request and response', () => {
    
    beforeAll(() => {
      return superagent.post(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .send({
          name: faker.lorem.word(),
          description: faker.lorem.words(4),
        })
        .then(res => this.res = res);
    });

    it('Should return a status code of 201 when creating a gallery', () => {
      expect(this.res.status).toEqual(201);
    });
    it('should return a valid gallery as the body of data', () => {
      expect(this.res.body).toHaveProperty('name');
      expect(this.res.body).toHaveProperty('description');
      expect(this.res.body).toHaveProperty('_id');
    });
    it('Should return a UserID that matches the mock user provided', () => {
      expect(this.res.body.userId).toEqual(this.mockUser.user._id.toString());
    });
  });

  describe('Invalid request and response', () => {
    it('Should return a status code of 401 NOT AUTHORIZED when given a bad token', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });
    it('Should return a status code of 400 BAD REQUEST when given an invalid body', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .send({})
        .catch(err => expect(err.status).toEqual(400));
    });
  });
});