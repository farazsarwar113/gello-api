const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('../comments/comments.model');
const Blog = new Schema(
  {
    title: String,
    description: String,
    html: String,
    tags: [String],
    comments: [Comment],
    // banner: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Asset'
    // },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Blog', Blog);
