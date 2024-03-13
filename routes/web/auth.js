var express = require('express');
var router = express.Router();
var AdminCtrl = require("../../controllers/admin/dang-nhap-web-controller");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-khachhang')
const sessionAdmin = require('../../config/auth/session-admin')

router.post('/',sessionAdmin.setTokenHeader, AdminCtrl.dangNhapWeb);
router.get('/sign-out', AdminCtrl.dangXuatWeb)
 
module.exports = router;