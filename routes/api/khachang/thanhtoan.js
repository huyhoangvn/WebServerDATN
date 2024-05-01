var express = require('express');
var router = express.Router();
const thanhToanCtrl = require('../../../controllers/thanhtoan/thanhtoan-controller')

router.post('/payZalo/:idHD',  thanhToanCtrl.paymentZalo);

router.get('/createQR/:idHD', thanhToanCtrl.createQR);

router.get('/nganhang',  thanhToanCtrl.danhSachNganHang);

// router.post('/result/:idHD', thanhToanController.testCallBack);

module.exports = router;