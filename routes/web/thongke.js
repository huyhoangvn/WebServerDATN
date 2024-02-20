var express = require('express');
var router = express.Router();
var AdminCtrl = require("../../controllers/admin/admin-controller");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-khachhang')
const sessionAdmin = require('../../config/auth/session-admin')

router.get('/doanh-thu',sessionAdmin.setTokenHeader, passport.authenticate('jwt', {session : false}), AdminCtrl.getViewThongKeDoanhThuWeb);
 
module.exports = router;