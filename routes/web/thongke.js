var express = require('express');
var router = express.Router();

var DoanhThuCtrl = require("../../controllers/thongke/doanh-thu-web-controller");
var MonBanChayCtrl = require("../../controllers/thongke/mon-ban-chay-web-controller");
var GiaoDichCtrl = require("../../controllers/thongke/giao-dich-web-controller");

const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-admin')
const sessionAdmin = require('../../config/auth/session-admin')

//
router.get('/doanh-thu', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), DoanhThuCtrl.getView);
router.get('/doanh-thu/theo-nam', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), DoanhThuCtrl.getChiTietDoanhThuTheoNam);
router.get('/mon-ban-chay', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), MonBanChayCtrl.getView);
router.get('/mon-ban-chay-filter', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), MonBanChayCtrl.getList);
router.get('/giao-dich', sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), GiaoDichCtrl.getView);



module.exports = router;