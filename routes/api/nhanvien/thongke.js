var express = require('express');
var router = express.Router();
const thongkeCrl = require('../../../controllers/thongke/thong-ke-controller-api');
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')

// thống kê doanh thu
router.get('/1-ngay',  thongkeCrl.thongKeDoanhThuTheoNgayApi);
router.get('/10-ngay',  thongkeCrl.thongKeDoanhThuTheo10NgayApi);
router.get('/30-ngay',  thongkeCrl.thongKeDoanhThuTheo30NgayApi);
router.get('/',  thongkeCrl.thongKeDoanhThuTheoNamApi);
router.get('/12-thang',  thongkeCrl.thongKeDoanhThuTheoThangTrongNamApi);

// thống kê món bán chạy theo tên loai món

router.get('/tenLM',  thongkeCrl.thongKeMonBanChayTheoTenLoaiMonApi);// hàm này dùng để tìm kiếm theo tên LM năm và tháng
router.get('/nam-tenLM',  thongkeCrl.thongKeMonBanChayTheoNamApi);// hàm này dùng để tìm kiếm theo năm và tháng

router.get('/ngay-to-ngay',  thongkeCrl.thongKeDoanhThuTheoNgaytoNgayApi);
router.get('/mon-ban-chay',  thongkeCrl.thongKeMonBanChayApi);


module.exports = router;