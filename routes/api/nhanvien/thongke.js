var express = require('express');
var router = express.Router();
const thongkeCrl = require('../../../controllers/thongke/thong-ke-controller-api');

// thống kê doanh thu
router.get('/1-ngay', thongkeCrl.thongKeDoanhThuTheoNgayApi);
router.get('/10-ngay', thongkeCrl.thongKeDoanhThuTheo10NgayApi);
router.get('/30-ngay', thongkeCrl.thongKeDoanhThuTheo30NgayApi);
router.get('/', thongkeCrl.thongKeDoanhThuTheoNamApi);
router.get('/12-thang', thongkeCrl.thongKeDoanhThuTheoThangTrongNamApi);

// thống kê món bán chạy tất cả

router.get('/1-ngay-tat-ca', thongkeCrl.thongKeMonBanChay1NgayTatCaApi);
router.get('/10-ngay-tat-ca', thongkeCrl.thongKeMonBanChay10NgayTatCaApi);
router.get('/30-ngay-tat-ca', thongkeCrl.thongKeMonBanChay30NgayTatCaApi);

// thống kê món bán chạy theo tên loai món

router.get('/1-ngay-ten', thongkeCrl.thongKeMonBanChay1NgayTheoTenLoaiMonApi);
router.get('/10-ngay-ten', thongkeCrl.thongKeMonBanChay10NgayTheoTenLoaiMonApi);
router.get('/30-ngay-ten', thongkeCrl.thongKeMonBanChay30NgayTheoTenLoaiMonApi);
module.exports = router;