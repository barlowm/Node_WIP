"use strict";

const express = require('express');
const Controller = require('../controller/controller');

const router = express.Router();

router.use(Controller.Dflt.dfltEntry);
router.route('/').get(Controller.Get.getData);
router.route('/').post(Controller.Post.postData);

module.exports = router;
