'use strict';

const faker = require('faker');
const mock = require('../lib/mocks.js');
const superagent = require('superagent');
const server = require('../../lib/server.js');
require('jest');

describe('PUT api/v1/gallery', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);

  beforeAll(() => mock.gallery.createOne().then(data => this.mockGallery = data));

  describe('Valid request and response', () => {
    it('Should return a status code of 204 with an updated gallery', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery/${this.mockGallery.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .send({
          name: faker.lorem.word(),
        })
        .then(res => {
          expect(res.status).toEqual(204);
        });
    });
  });
  describe('Invalid request and response', () => {
    it('Should return a status code of 401 when given bad token', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer BADTOKEN')
        .send({
          name: faker.lorem.word(),
        })
        .catch(err => expect(err.status).toEqual(401));
    });
    it('Should return a status code of 404 status for not found', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/galle`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .send({
          name: faker.lorem.word(),
        })
        .catch(err => expect(err.status).toEqual(404));
    });
    it('Should return a status 400 when not provided a valid request body', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .send({
          noname: faker.lorem.word(),
        })
        .catch(err => expect(err.status).toEqual(400));
    });
  });
});