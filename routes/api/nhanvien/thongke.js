var express = require('express');
var router = express.Router();
const thongkeCrl = require('../../../controllers/thongke/thong-ke-controller');

router.get('/1-ngay', thongkeCrl.thongKeDoanhThuTheoNgayApi);
router.get('/10-ngay', thongkeCrl.thongKeDoanhThuTheo10NgayApi);
router.get('/30-ngay', thongkeCrl.thongKeDoanhThuTheo30NgayApi);
router.get('/:nam', thongkeCrl.thongKeDoanhThuTheoNamApi);
router.get('/12-thang/:nam', thongkeCrl.thongKeDoanhThuTheoThangTrongNamApi);

module.exports = router;