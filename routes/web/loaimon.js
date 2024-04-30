var express = require('express');
var router = express.Router();
var LoaiMonCtrl = require("../../controllers/loaimon/loai-mon-web-controller");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-admin')
const sessionAdmin = require('../../config/auth/session-admin')

router.get('/danh-sach', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), LoaiMonCtrl.getList);
router.post('/add', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), LoaiMonCtrl.AddLoaiMon);
router.get('/sua-trang-thai/:idLM', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), LoaiMonCtrl.xoaLoaiMon);

module.exports = router;
