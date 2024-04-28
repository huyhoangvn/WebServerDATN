var express = require('express');
var router = express.Router();
const thongkeCrl = require('../../../controllers/thongke/thong-ke-controller-api');
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')

// thống kê doanh thu
router.get('/1-ngay', passport.authenticate('jwt', { session: false }), thongkeCrl.thongKeDoanhThuTheoNgayApi);
router.get('/10-ngay', passport.authenticate('jwt', { session: false }), thongkeCrl.thongKeDoanhThuTheo10NgayApi);
router.get('/30-ngay', passport.authenticate('jwt', { session: false }), thongkeCrl.thongKeDoanhThuTheo30NgayApi);
router.get('/', passport.authenticate('jwt', { session: false }), thongkeCrl.thongKeDoanhThuTheoNamApi);
router.get('/12-thang', passport.authenticate('jwt', { session: false }), thongkeCrl.thongKeDoanhThuTheoThangTrongNamApi);

// thống kê món bán chạy theo tên loai món

router.get('/tenLM', passport.authenticate('jwt', { session: false }), thongkeCrl.thongKeMonBanChayTheoTenLoaiMonApi);// hàm này dùng để tìm kiếm theo tên LM năm và tháng
router.get('/nam-tenLM', passport.authenticate('jwt', { session: false }), thongkeCrl.thongKeMonBanChayTheoNamApi);// hàm này dùng để tìm kiếm theo năm và tháng

router.get('/ngay-to-ngay', passport.authenticate('jwt', { session: false }), thongkeCrl.thongKeDoanhThuTheoNgaytoNgayApi);
router.get('/mon-ban-chay', passport.authenticate('jwt', { session: false }), thongkeCrl.thongKeMonBanChayApi);

router.get('/mon-ban-chay-web', thongkeCrl.thongKeMonBanChayWebApi);

module.exports = router;