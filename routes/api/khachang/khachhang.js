var express = require('express');
var router = express.Router();
var KhachHangCtrl = require("../../../controllers/khachhang/khachhang-controller");

/* GET users listing. */
router.post('/dang-ky', KhachHangCtrl.dangKyApi); //http://localhost:3000/api/khachhang/khachhang/dangKy
router.post('/dang-nhap', KhachHangCtrl.dangNhap); //http://localhost:3000/api/khachhang/khachhang/dangNhap

router.get('/:id', KhachHangCtrl.getKhachHangbyidKhachHang);

router.post('/doi-mat-khau/:id', KhachHangCtrl.updateMatKhau);

router.put('/update/:idKH', KhachHangCtrl.updateKhachHang); //http://localhost:3000/api/khachhang/khachhang/updateKhachHang

router.post('/find-account/:email',KhachHangCtrl.finAccount); //http://localhost:3000/api/khachhang/khachhang/find-account

module.exports = router;
