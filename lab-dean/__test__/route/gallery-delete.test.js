'use strict';

const mock = require('../lib/mocks.js');
const superagent = require('superagent');
const server = require('../../lib/server.js');
require('jest');

describe('DELETE api/v1/gallery', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);

  beforeAll(() => mock.gallery.createOne().then(data => this.mockGallery = data));

  describe('Valid request', () => {
    it('should return a 204 delete status code', () => {
      return mock.gallery.createOne()
        .then(mock => {
          this.resultMock = mock;
          return superagent.delete(`:${process.env.PORT}/api/v1/gallery/${this.resultMock.gallery._id}`)
            .set('Authorization', `Bearer ${this.mockGallery.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
  });
  describe('Invalid request', () => {
    it('should return a 401 given bad token', () => {
      return superagent.delete(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 404 no found', () => {
      return superagent.delete(`:${process.env.PORT}/api/v1/galle`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});