const config = require('@config');
const mongoose = require('mongoose');
const log = require('@common/log');

exports.connect = function () {
  mongoose.connect(config.mongoUrl);
  const db = mongoose.connection;
  db.on(`error`, console.error.bind(console, `connection error:`));
  db.once(`open`, function () {
    // we`re connected!
    log(`MongoDB connected on "  ${config.mongoUrl}`);
    log(`###########################################################################`);
  });
};

