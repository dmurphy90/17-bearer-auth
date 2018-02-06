'use strict';

const Gallery = require('../model/gallery.js');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler.js');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware.js');

module.exports = router => {
  router.route('/gallery/:id?')
    .post(bearerAuthMiddleware, bodyParser, (request, response) => {

      request.body.userId = request.user._id;

      return new Gallery(request.body).save()
        .then(createdGallery => response.status(201).json(createdGallery))
        .catch(err => errorHandler(err, res));
    })

    .get(bearerAuthMiddleware,(req, res) => {
      if(req.params._id) {
        return Gallery.findById(req.params._id)
          .then(gallery => res.status(200).json(gallery))
          .catch(err => errorHandler(err, res));
      }

      return Gallery.find()
        .then(galleries => {
          let galleriesIds = galleries.map(gallery => gallery._id);

          res.status(200).json(galleriesIds);
        })
        .catch(err => errorHandler(err, res));
    });
};