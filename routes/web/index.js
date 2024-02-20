var express = require('express');
var router = express.Router();
var AdminCtrl = require("../../controllers/admin/admin-controller");
var AdminCtrl = require("../../controllers/admin/admin-controller");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-khachhang')
const sessionAdmin = require('../../config/auth/session-admin')

/* GET users listing. */
router.get('/', AdminCtrl.getViewDangNhapWeb);
router.use('/auth', require('./auth'))
router.use('/khach-hang', require('./khachhang'))
router.use('/nhan-vien', require('./nhanvien'))
router.use('/cua-hang', require('./cuahang'))
router.use('/hoa-don', require('./hoadon'))
router.use('/dat-mon', require('./datmon'))
router.use('/gio-hang', require('./giohang'))
router.use('/danh-gia', require('./danhgia'))
router.use('/khuyen-mai', require('./khuyenmai'))
router.use('/loai-mon', require('./loaimon'))
router.use('/mon', require('./mon'))
router.use('/hinh-anh-mon', require('./hinhanhmon'))
router.use('/thong-ke', require('./thongke'))

module.exports = router;
