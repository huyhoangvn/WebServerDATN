var express = require('express');
var router = express.Router();
const passport = require('passport')
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')

const slideController = require('../../../controllers/slide/slide.controller');
/* GET users listing. */
router.get('/', passport.authenticate('jwt', { session: false }), slideController.getImageSlide);

module.exports = router;
