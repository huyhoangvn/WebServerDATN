var express = require('express');
var router = express.Router();

router.use('/auth', require('./auth'))
router.use('/cuahang', require('./cuahang'))
router.use('/nhanvienban', require('./nhanvienban'))
router.use('/nhanvienquanly', require('./nhanvienquanly'))
router.use('/hoadon', require('./hoadon'))
router.use('/datmon', require('./datmon'))
router.use('/danhgia', require('./danhgia'))
router.use('/khuyenmai', require('./khuyenmai'))
router.use('/loaimon', require('./loaimon'))
router.use('/mon', require('./mon'))

module.exports = router;
