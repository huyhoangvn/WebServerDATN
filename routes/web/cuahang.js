var express = require('express');
var router = express.Router();
var CuaHangCtrl = require("../../controllers/cuahang/cua-hang-web-controller");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-admin')
const sessionAdmin = require('../../config/auth/session-admin')

router.get('/danh-sach', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), CuaHangCtrl.getList);
router.get('/them-moi', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), CuaHangCtrl.getAddView);
router.post('/add', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), CuaHangCtrl.getAdd);
router.get('/chi-tiet/:idCH', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), CuaHangCtrl.chiTietCuaHang);
router.get('/xoa/:idCH', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), CuaHangCtrl.xoaCuaHang);

router.post('/them-nv/:idCH', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), CuaHangCtrl.themNhanVienQuanLy);

router.post('/xoa/:idNV', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), CuaHangCtrl.xoaNhanVien);

module.exports = router;