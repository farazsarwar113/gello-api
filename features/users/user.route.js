const express = require('express');
const router = express.Router();
const verify = require('@common/verify');
const userCtrl = require('./user.ctrl.js');

router.route(`/`)
  .get(verify.nocache, verify.user, verify.unseal, verify.admin, userCtrl.listAll);

router.route(`/register`)
  .post(userCtrl.register);

router.route(`/login`)
  .post(userCtrl.login);

router.route(`/logout`)
  .get(userCtrl.logout);

router.route(`/me`)
  .get(verify.nocache, verify.user, verify.unseal, userCtrl.verifyUser);

module.exports = router;
