var express = require('express');
var router = express.Router();
var multer = require("./../../../config/multer-config");

const hoadonctrl = require('../../../controllers/hoadon/hoadon-controller-api');

router.get('/:idKH',  hoadonctrl.getDanhSachHoaDonByIdKhachHangApi);


router.get('/detail/:id',  hoadonctrl.chiTietHoaDonApi);

router.delete('/delete/:idHD',  hoadonctrl.deleteHoaDonApi); // hủy 

router.post('/thanh-toan-chuyen-khoan/:idHD',  multer.upload.fields([{ name: 'hinhAnhXacNhan', maxCount: 1 }]), hoadonctrl.xacNhanThanhToanChuyenKhoanApi);

router.post('/thanh-toan-tien-mat/:idHD',  hoadonctrl.xacNhanThanhToanTienMatApi);


module.exports = router;
