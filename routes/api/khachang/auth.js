var express = require('express');
var router = express.Router();
var KhachHangDangNhapCtrl = require("../../../controllers/khachhang/dangnhap-controller.js");
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

router.post('/', passport.authenticate('jwt', { session: false }), KhachHangDangNhapCtrl.dangNhapApi);

module.exports = router;


