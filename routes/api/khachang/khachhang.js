var express = require('express');
var router = express.Router();
var multer = require("./../../../config/multer-config");
var KhachHangCtrl = require("../../../controllers/khachhang/khachhang-controller");

/* GET users listing. */
router.post('/dang-ky', KhachHangCtrl.dangKyApi); //http://localhost:3000/api/khachhang/khachhang/dangKy
router.post('/dang-nhap', KhachHangCtrl.dangNhap); //http://localhost:3000/api/khachhang/khachhang/dangNhap

router.get('/:id', KhachHangCtrl.getKhachHangbyidKhachHang);

router.post('/doi-mat-khau/:id', KhachHangCtrl.updateMatKhau);

router.put("/:idKH", multer.upload.fields([{ name: 'hinhAnh', maxCount: 1 }]), KhachHangCtrl.updateKhachHang); //http://localhost:3000/api/khachhang/khachhang/updateKhachHang

module.exports = router;
