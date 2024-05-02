var express = require('express');
const VerificationControllers = require('../../../controllers/khachhang/verification.controller');
const KhachHangCtrl = require('../../../controllers/khachhang/khachhang-controller');

var router = express.Router();

/* GET users listing. */
router.post('/', VerificationControllers.verification);
router.post('/dang-ky', KhachHangCtrl.dangKyApi); //http://localhost:3000/api/khachhang/khachhang/dangKy
router.put('/forgot-password/:id', KhachHangCtrl.forgotPassword); //http://localhost:3000/api/khachhang/khachhang/forgot-password
router.post('/find-account/:email', KhachHangCtrl.finAccount); //http://localhost:3000/api/khachhang/khachhang/find-account

module.exports = router;
