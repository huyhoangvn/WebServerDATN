var express = require('express');
var router = express.Router();
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

router.use('/auth', require('./auth'))
router.use('/', passport.authenticate('khachhang-jwt', { session: false }), require('./khachhang'))
router.use('/cuahang', passport.authenticate('khachhang-jwt', { session: false }), require('./cuahang'))
router.use('/hoadon', passport.authenticate('khachhang-jwt', { session: false }), require('./hoadon'))
router.use('/datmon', passport.authenticate('khachhang-jwt', { session: false }), require('./datmon'))
router.use('/giohang', passport.authenticate('khachhang-jwt', { session: false }), require('./giohang'))
router.use('/danhgia', passport.authenticate('khachhang-jwt', { session: false }), require('./danhgia'))
router.use('/khuyenmai', passport.authenticate('khachhang-jwt', { session: false }), require('./khuyenmai'))
router.use('/loaimon', passport.authenticate('khachhang-jwt', { session: false }), require('./loaimon'))
router.use('/mon', passport.authenticate('khachhang-jwt', { session: false }), require('./mon'))
router.use('/slide', passport.authenticate('khachhang-jwt', { session: false }), require('./slide'))
router.use('/hinhanh', passport.authenticate('khachhang-jwt', { session: false }), require('./hinhanhmon'))
router.use('/khuyenmaicuatoi', passport.authenticate('khachhang-jwt', { session: false }), require('./khuyenmaicuatoi'))
router.use('/thongke', passport.authenticate('khachhang-jwt', { session: false }), require('./thongke'))
router.use('/thanhtoan', passport.authenticate('khachhang-jwt', { session: false }), require('./thanhtoan'))

router.use('/verification', require('../verification/verification'))

module.exports = router;
