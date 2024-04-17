var express = require('express');
var router = express.Router();
var NhanVienDangNhapCtrl = require("../../../controllers/nhanvien/dangnhap-controller");
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')

router.post('/', passport.authenticate('jwt', { session: false }), NhanVienDangNhapCtrl.dangNhapApi);

module.exports = router;
