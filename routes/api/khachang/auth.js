var express = require('express');
var router = express.Router();
var KhachHangDangNhapCtrl = require("../../../controllers/khachhang/dangnhap-controller.js");

router.post('/', KhachHangDangNhapCtrl.dangNhapApi);

module.exports = router;


