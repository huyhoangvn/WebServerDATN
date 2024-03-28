var express = require('express');
var router = express.Router();
var AdminCtrl = require("../../controllers/admin/dang-nhap-web-controller");

/* GET users listing. */
router.get('/', AdminCtrl.getViewDangNhapWeb);
router.use('/auth', require('./auth'))
router.use('/khach-hang', require('./khachhang'))
router.use('/quan-ly', require('./quanly'))
router.use('/cua-hang', require('./cuahang'))
router.use('/khuyen-mai', require('./khuyenmai'))
router.use('/loai-mon', require('./loaimon'))
router.use('/mon', require('./mon'))
router.use('/thong-ke', require('./thongke'))
router.use('/hoa-don', require('./hoadon'))

module.exports = router;
