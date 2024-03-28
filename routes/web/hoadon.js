var express = require('express');
var router = express.Router();
var HoaDonCtrl = require("../../controllers/hoadon/hoa-don-web-controller");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-admin')
const sessionAdmin = require('../../config/auth/session-admin')

router.get('/danh-sach', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), HoaDonCtrl.getList);

router.get('/chi-tiet/:idCH', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), HoaDonCtrl.getChiTiet);

module.exports = router;