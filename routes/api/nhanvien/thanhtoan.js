var express = require('express');
var router = express.Router();
const thanhToanCtrl = require('../../../controllers/thanhtoan/thanhtoan-controller')
const passport = require('passport')
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')

router.get('/nganhang',  thanhToanCtrl.danhSachNganHang);

// router.post('/result/:idHD', thanhToanController.testCallBack);

module.exports = router;