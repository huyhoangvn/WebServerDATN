var express = require('express');
var router = express.Router();
var KhachHangCtrl = require("../../controllers/khachhang/khach-hang-web-controller");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-admin')
const sessionAdmin = require('../../config/auth/session-admin')

router.get('/danh-sach', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), KhachHangCtrl.getList);
router.get('/xoa/:idKH', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), KhachHangCtrl.xoaKhachHang);

module.exports = router;
