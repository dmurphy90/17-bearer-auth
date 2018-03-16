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

  describe('Valid requests', () => {
    it('should return a 204 status with an updated gallery', () => {
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
  describe('Invalid requests', () => {
    it('should return a 401 with an invalid token', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer BADTOKEN')
        .send({
          name: faker.lorem.word(),
        })
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 404 status for not found', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/galle`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .send({
          name: faker.lorem.word(),
        })
        .catch(err => expect(err.status).toEqual(404));
    });
    it('should return a 400 with an bad request', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .send({
          noname: faker.lorem.word(),
        })
        .catch(err => expect(err.status).toEqual(400));
    });
  });
});