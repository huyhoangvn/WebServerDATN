var express = require('express');
var router = express.Router();

router.use('/khachhang', require('./khachang/index'))
router.use('/nhanvien', require('./nhanvien/index'))
router.use('/test', require('./test/test'))

module.exports = router;
