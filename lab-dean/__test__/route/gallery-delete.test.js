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

  describe('Valid request and response', () => {
    it('Should return a 204 status code when gallery is deleted', () => {
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
  describe('Invalid request and response', () => {
    it('Should return a status code of 401 when given bad token', () => {
      return superagent.delete(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });
    it('Should return a status code of 404 with invalid route', () => {
      return superagent.delete(`:${process.env.PORT}/api/v1/galle`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});