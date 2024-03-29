var express = require('express');
var router = express.Router();
var KhuyenMaiCtrl = require("../../controllers/khuyenmai/khuyen-mai-web-controller");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-admin')
const sessionAdmin = require('../../config/auth/session-admin')

router.get('/danh-sach',sessionAdmin.setTokenHeader, passport.authenticate('jwt', {session : false}), KhuyenMaiCtrl.getList);
router.get('/them-moi',sessionAdmin.setTokenHeader, passport.authenticate('jwt', {session : false}), KhuyenMaiCtrl.getAdd);

module.exports = router;
