var express = require('express');
var router = express.Router();
var NhanVienQuanlyCtrl = require("../../controllers/nhanvien/quan-ly-web-controller");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-admin')
const sessionAdmin = require('../../config/auth/session-admin')

router.get('/danh-sach',sessionAdmin.setTokenHeader, passport.authenticate('jwt', {session : false}), NhanVienQuanlyCtrl.getList);
router.get('/chi-tiet/:idNV',sessionAdmin.setTokenHeader, passport.authenticate('jwt', {session : false}), ()=>{ res.end("Chi tiết") });

module.exports = router;
