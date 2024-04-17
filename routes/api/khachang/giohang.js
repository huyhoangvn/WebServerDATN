var express = require('express');
var router = express.Router();
var GioHangCtrl = require("../../../controllers/giohang/giohang-controller");
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

/* GET users listing. */
router.post('/them/:idKH', passport.authenticate('jwt', { session: false }), GioHangCtrl.addGioHang);
router.delete('/delete/:idKH', passport.authenticate('jwt', { session: false }), GioHangCtrl.deleteGioHang);
router.get('/danh-sach/:idKH', passport.authenticate('jwt', { session: false }), GioHangCtrl.getAllGioHangApi);


router.post('/isMonExist/:idKH', passport.authenticate('jwt', { session: false }), GioHangCtrl.kiemTraGioHang);
module.exports = router;
