var express = require('express');
var router = express.Router();
var KhachHangCtrl = require("../../../controllers/khachhang/khachhang-controller");

/* GET users listing. */
router.post('/dang-ky', KhachHangCtrl.dangKyApi); //http://localhost:3000/api/khachhang/khachhang/dangKy
router.post('/dang-nhap', KhachHangCtrl.dangNhap); //http://localhost:3000/api/khachhang/khachhang/dangNhap

router.put('/:id', KhachHangCtrl.updateKhachHang); //http://localhost:3000/api/khachhang/khachhang/updateKhachHang

module.exports = router;
