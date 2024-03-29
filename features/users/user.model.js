const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({

  username: String,
  password: String,
  OauthId: String,
  OauthToken: String,
  firstname: {
    type: String,
    default: ``
  },
  lastname: {
    type: String,
    default: ``
  },
  admin: {
    type: Boolean,
    default: false
  },
  resetToken: {
    type: String,
    default: ``
  }
}

);
User.plugin(passportLocalMongoose);

module.exports = mongoose.model(`User`, User);
