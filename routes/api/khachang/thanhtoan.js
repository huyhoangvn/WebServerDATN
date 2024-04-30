var express = require('express');
var router = express.Router();
const thanhToanCtrl = require('../../../controllers/thanhtoan/thanhtoan-controller')
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

router.post('/payZalo/:idHD', passport.authenticate('jwt', { session: false }), thanhToanCtrl.paymentZalo);

router.get('/createQR/:idHD',passport.authenticate('jwt', { session: false }), thanhToanCtrl.createQR);

router.get('/nganhang', passport.authenticate('jwt', { session: false }), thanhToanCtrl.danhSachNganHang);

// router.post('/result/:idHD', thanhToanController.testCallBack);

module.exports = router;