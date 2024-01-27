var express = require('express');
var router = express.Router();

router.use('/auth', require('./auth'))
router.use('/cuahang', require('./cuahang'))
router.use('/hoadon', require('./hoadon'))
router.use('/datmon', require('./datmon'))
router.use('/giohang', require('./giohang'))
router.use('/danhgia', require('./danhgia'))
router.use('/khuyenmai', require('./khuyenmai'))
router.use('/loaimon', require('./loaimon'))
router.use('/mon', require('./mon'))
router.use('/hinhanh', require('./hinhanhmon'))

module.exports = router;
