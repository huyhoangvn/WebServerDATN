var express = require('express');
var router = express.Router();
var KhachHangCtrl = require("../../../controllers/khachhang/khachhang-controller");

/* GET users listing. */
router.post('/dang-ky', KhachHangCtrl.dangKyApi); //http://localhost:3000/api/khachhang/khachhang/dangKy
router.post('/dang-nhap',KhachHangCtrl.dangNhap); //http://localhost:3000/api/khachhang/khachhang/dangNhap
router.get('/',KhachHangCtrl.getKhachHangTheoTen); // http://localhost:3000/api/khachhang/khachhang/getKhachHangTheoTen
router.get('/so-luong',KhachHangCtrl.getSoLuongKhachHangApi); // http://localhost:3000/api/khachhang/khachhang/getSoLuongKhachHang
router.put('/:id',KhachHangCtrl.updateKhachHang); //http://localhost:3000/api/khachhang/khachhang/updateKhachHang
router.delete('/:id',KhachHangCtrl.deleteKhachHang);//http://localhost:3000/api/khachhang/khachhang/deleteKhachHang
module.exports = router;
