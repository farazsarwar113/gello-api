// Models Requires
const Joi = require('Joi');
// User Package Requires
const log = require('@common/log');

exports.validate = function (incomingData, schemaValidation) {
  return new Promise(function (resolve, reject) {
    Joi.validate(incomingData, schemaValidation, function (err, value) {
      if (err) {

        log(err);
        return reject(err);
      } else {

        resolve(value);
      }
    });
  });
};
