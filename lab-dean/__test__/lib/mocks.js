'use strict';

const faker = require('faker');
const Auth = require('../../model/auth.js');

const mock = module.exports = {};

mock.auth = {};

mock.auth.createOne = () => {
  return new Auth({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password,
  });
};

mock.auth.removeAll = () => Promise.all([Auth.remove()]);