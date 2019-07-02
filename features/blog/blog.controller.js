// const Asset = require('../assets/assets.model');
const Blog = require('./blog.model');
// const assetCtrl = require('../assets/assets.controller');
// const htmlParser = require('../../server/htmlParser');

exports.getAllBlogs = (req, res, next) => {
  const perPage = 10;
  const page = Math.max(0, req.query.page || 0);
  let filter = {};
  if (req.query.tags) {
    const tags = req.query.tags.split(',');
    filter = {
      'tags': { '$in': tags }
    };
  }
  let query;
  if (req.query.page) {
    query = Blog.find(filter)
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(perPage * page)
      .populate('user comments.user');
  } else {
    query = Blog.find(filter)
      .sort({ createdAt: -1 })
      .populate('user comments.user');
  }

  query.exec((err, blogs) => {
    if (err) {
      return next({
        message: 'Something went wrong',
        status: false,
        data: err
      });
    }
    return res.json({
      message: 'Blogs found',
      status: true,
      data: blogs
    });
  });
};
exports.addBlog = (req, res, next) => {
  // const html = htmlParser(req.body.html);
  const data = {
    title: req.body.title,
    description: req.body.description,
    html: req.body.html,
    user: req._user._id,
    tags: req.body.tags || [],
    comments: []
    // banner: req.body.banner || undefined // eslint-disable-line
  };
  Blog.create(data, (err, blog) => {
    if (err) {
      return next({
        message: 'Something went wrong',
        status: false,
        data: err
      });
    }
    return res.json({
      message: 'Blog created',
      status: true,
      data: blog
    });
  });
};
exports.getBlog = (req, res, next) => {
  Blog.findById(req.params.id)
    .populate('user comments.user')
    .exec((err, blog) => {
      if (err) {
        return next({
          message: 'Something went wrong',
          status: false,
          data: err
        });
      }
      if (!blog) {
        return next({
          message: 'Blog not found, please check blog id',
          status: false,
          data: null
        });
      }
      return res.json({
        message: 'Blog found',
        status: true,
        data: blog
      });
    });
};
exports.updateBlog = (req, res, next) => {
  // const html = htmlParser(req.body.html);
  // req.body.html = html;
  Blog.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .exec((err, blog) => {
      if (err) {
        return next({
          message: 'Something went wrong',
          status: false,
          data: err
        });
      }
      if (!blog) {
        return next({
          message: 'Blog not found, please check blog id',
          status: false,
          data: null
        });
      }
      return res.json({
        message: 'Blog updated',
        status: true,
        data: blog
      });
    });
};
exports.deleteBlog = (req, res, next) => {
  Blog.findByIdAndRemove(req.params.id)
    .exec((err, blog) => {
      if (err) {
        return next({
          message: 'Something went wrong',
          status: false,
          data: err
        });
      }
      if (!blog) {
        return next({
          message: 'Blog not found, please check blog id',
          status: false,
          data: null
        });
      }
      return res.json({
        message: 'Blog deleted',
        status: true,
        data: blog
      });
    });
};
// exports.uploadBlogImg = (req, res, next) => {
//   Blog.findById(req.params.id)
//     .exec(async (err, blog) => {
//       if (err) {
//         return next({
//           message: 'Something went wrong',
//           status: false,
//           data: err
//         });
//       }
//       if (!blog) {
//         return next({
//           message: 'Blog not found, please check blog id',
//           status: false,
//           data: null
//         });
//       }
//       const filename = req.body.filename ? req.body.filename : `${Date.now()}_${req.params.id}.jpeg`;
//       const buf = new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
//       const fileData = {
//         Key: `images/${filename}`,
//         Body: buf,
//         ContentEncoding: 'base64',
//         ContentType: 'image/jpeg'
//       };
//       try {
//         const file = await assetCtrl.uploadFile(fileData);
//         const asset = new Asset({
//           link: file
//         });
//         const savedAsset = await asset.save();
//         blog.banner = savedAsset._id;
//         blog.save((err, blog) => { // eslint-disable-line
//           if (err) {
//             return next({
//               message: 'Something went wrong',
//               status: false,
//               data: err
//             });
//           }
//           return res.json({
//             message: 'Blog image uploaded',
//             status: true,
//             data: blog
//           });
//         });
//       } catch (err) {
//         return next({
//           message: 'Something went wrong',
//           status: false,
//           data: err
//         });
//       }
//     });
// };

exports.addComments = (req, res, next) => {
  req.body.user = req._user._id;
  Blog.findByIdAndUpdate(req.params.id, { $push: { comments: req.body } }, { new: true }, function (err, blog) {
    if (err) {
      return next({
        message: 'Something went wrong',
        data: err
      });
    }
    if (!blog) {
      return res.status(500).json({
        message: 'Blog not found, please check blog id',
        data: null
      });
    }
    Blog.populate(blog, 'user comments.user', (err, updatedblog) => {
      if (err) {
        return next({
          message: 'Something went wrong',
          data: err
        });
      }
      return res.json({
        message: 'Successfully added comment to blog',
        success: true,
        data: updatedblog
      });
    });
  });
};
exports.editComment = (req, res, next) => {
  req.body.user = req._user._id;
  const comment = { ...req.body };
  Blog.findById(req.params.id, function (err, blog) {
    if (err) {
      return next({
        message: 'Something went wrong',
        data: err
      });
    }

    if (!blog) {
      return res.status(500).json({
        message: 'Blog not found, please check blog id',
        data: null
      });
    }

    for (let i = 0; i < blog.comments.length; i++) {
      if (blog.comments[i]._id.toString() === req.params.cid.toString() && blog.comments[i].user.toString() === req._user._id.toString()) {
        blog.comments[i].text = comment.text || blog.comments[i].text;
      }
    }
    blog.save(function (err, updatedblog) {
      if (err) {
        return next({
          message: 'Something went wrong',
          data: err
        });
      }
      res.json({
        message: 'Successfully edit comment',
        success: true,
        data: updatedblog
      });
    });
  });
};

exports.deleteComment = (req, res, next) => {
  Blog.findById(req.params.id, function (err, blog) {
    if (err) {
      return next({
        message: 'Something went wrong',
        data: err
      });
    }
    if (!blog) {
      return res.status(500).json({
        message: 'Blog not found, please check blog id',
        data: null
      });
    }
    for (let i = 0; i < blog.comments.length; i++) {
      if (blog.comments[i]._id.toString() === req.params.cid.toString() && blog.comments[i].user.toString() === req._user._id.toString()) {
        blog.comments.splice(i, 1);
      }
    }
    blog.save(function (err, updatedblog) {
      if (err) {
        return next({
          message: 'Something went wrong',
          data: err
        });
      }
      return res.json({
        message: 'Successfully deleted blog commet',
        success: true,
        data: updatedblog
      });
    });
  });
};
