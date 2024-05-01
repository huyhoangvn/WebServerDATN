var express = require('express');
var router = express.Router();
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')

router.use('/auth', require('./auth'))
router.use('/cuahang', passport.authenticate('nhanvien-jwt', { session: false }), require('./cuahang'))
router.use('/nhanvienban', passport.authenticate('nhanvien-jwt', { session: false }), require('./nhanvienban'))
router.use('/nhanvienquanly', passport.authenticate('nhanvien-jwt', { session: false }), require('./nhanvienquanly'))
router.use('/hoadon', passport.authenticate('nhanvien-jwt', { session: false }), require('./hoadon'))
router.use('/datmon', passport.authenticate('nhanvien-jwt', { session: false }), require('./datmon'))
router.use('/danhgia', passport.authenticate('nhanvien-jwt', { session: false }), require('./danhgia'))
router.use('/khuyenmai', passport.authenticate('nhanvien-jwt', { session: false }), require('./khuyenmai'))
router.use('/loaimon', passport.authenticate('nhanvien-jwt', { session: false }), require('./loaimon'))
router.use('/mon', passport.authenticate('nhanvien-jwt', { session: false }), require('./mon'))
router.use('/thongke', passport.authenticate('nhanvien-jwt', { session: false }), require('./thongke'))
router.use('/thanhtoan', passport.authenticate('nhanvien-jwt', { session: false }), require('./thanhtoan'))

module.exports = router;
