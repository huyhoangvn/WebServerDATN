var express = require('express');
const VerificationControllers = require('../../../controllers/khachhang/verification.controller');
var router = express.Router();
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

/* GET users listing. */
router.post('/', VerificationControllers.verification);

module.exports = router;