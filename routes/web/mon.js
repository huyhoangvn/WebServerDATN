var express = require('express');
var router = express.Router();
var MonCtrl = require("../../controllers/mon/mon-web-controller");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-admin')
const sessionAdmin = require('../../config/auth/session-admin')

router.get('/danh-sach', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), MonCtrl.getList);
// router.get('/chi-tiet/:idMon',sessionAdmin.setTokenHeader, passport.authenticate('jwt', {session : false}), ()=>{ res.end("Chi tiết") });
router.get('/chi-tiet/:idMon', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), MonCtrl.getChiTietMon);
router.get('/sua-trang-thai/:idMon', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), MonCtrl.xoaMon);
router.get('/xoa-danh-gia/:idDG', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), MonCtrl.xoaDanhGia);


module.exports = router;
