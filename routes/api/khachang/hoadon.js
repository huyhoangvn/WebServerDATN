var express = require('express');
var router = express.Router();
var multer = require("./../../../config/multer-config");

const hoadonctrl = require('../../../controllers/hoadon/hoadon-controller-api');
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

router.get('/:idKH', passport.authenticate('jwt', { session: false }), hoadonctrl.getDanhSachHoaDonByIdKhachHangApi);


router.get('/detail/:id', passport.authenticate('jwt', { session: false }), hoadonctrl.chiTietHoaDonApi);

router.delete('/delete/:idHD', passport.authenticate('jwt', { session: false }), hoadonctrl.deleteHoaDonApi); // hủy 

router.post('/thanh-toan-chuyen-khoan/:idHD', passport.authenticate('jwt', { session: false }), multer.upload.fields([{ name: 'hinhAnhXacNhan', maxCount: 1 }]), hoadonctrl.xacNhanThanhToanChuyenKhoanApi);

router.post('/thanh-toan-tien-mat/:idHD', passport.authenticate('jwt', { session: false }), hoadonctrl.xacNhanThanhToanTienMatApi);


module.exports = router;
