const express = require('express');
const router = express.Router();
const blogCtrl = require('./blog.controller.js');
const verify = require('../../common/verify');

router.route('/')
  .get(blogCtrl.getAllBlogs)
  .post(verify.user, verify.unseal, blogCtrl.addBlog);

router.route('/:id')
  .get(blogCtrl.getBlog)
  .put(verify.user, verify.unseal, blogCtrl.updateBlog)
  .delete(verify.user, verify.unseal, blogCtrl.deleteBlog);

// router.route('/:id/banner')
//   .put(verify.user, verify.unseal, blogCtrl.uploadBlogImg);

router.route('/:id/comments')
  .post(verify.user, verify.unseal, blogCtrl.addComments);

router.route('/:id/comments/:cid')
  .post(verify.user, verify.unseal, blogCtrl.editComment)
  .delete(verify.user, verify.unseal, blogCtrl.deleteComment);

module.exports = router;
