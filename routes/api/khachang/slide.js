var express = require('express');
var router = express.Router();

const slideController = require('../../../controllers/slide/slide.controller');
/* GET users listing. */
router.get('/',  slideController.getImageSlide);

module.exports = router;
