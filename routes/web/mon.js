var express = require('express');
var router = express.Router();
var MonCtrl = require("../../controllers/mon/mon-web-controller");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-admin')
const sessionAdmin = require('../../config/auth/session-admin')

router.get('/danh-sach',sessionAdmin.setTokenHeader, passport.authenticate('jwt', {session : false}), MonCtrl.getList);
router.get('/chi-tiet/:idMon',sessionAdmin.setTokenHeader, passport.authenticate('jwt', {session : false}), ()=>{ res.end("Chi tiết") });

module.exports = router;
