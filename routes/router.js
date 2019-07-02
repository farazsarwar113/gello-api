const express = require('express');
// default user route Import
const user = require('../features/users/user.route');
const blog = require('../features/blog/blog.router');

module.exports = function (app) {

  const router = express.Router();
  // default user route
  router.use(`/users`, user);
  router.use(`/blogs`, blog);

  app.use(`/api`, router);

};

