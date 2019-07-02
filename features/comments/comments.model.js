const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Comment = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: String
}, { timestamps: true, usePushEach: true });

module.exports = Comment;
