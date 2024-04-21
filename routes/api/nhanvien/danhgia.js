var express = require('express');
var router = express.Router();

const {
  ThemDanhGia,
  SuaDanhGia,
  XoaDanhGia,
  GetDanhSachTheoTenMon,
  GetDanhSachTheoTenKhachHang,
  GetDanhGiaTheoId,
  GetTrungBinhDanhGiaTheoMon,
  GetSoLuongDanhGiaTheoKhachHang,
  getTatCaDanhGiaTheoMonApi,
  GetDanhSachDanhGiaTheoMonVoiFilter,
  GetDanhSachDanhGiaTheoMonVoiFilterApi,
  getTrungBinhDanhGiaApi } = require('../../../controllers/danhgia/danhgia-controller');
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')

/* GET users listing. */
router.get("/get-theo-ten-mon/:idMon", passport.authenticate('jwt', { session: false }), GetDanhSachTheoTenMon);
// http://localhost:3000/api/khachhang/danhgia/get-theo-ten-khach-hang/65cc2e9d557054378b5490b2
router.get("/get-theo-ten-khach-hang/:idKH", passport.authenticate('jwt', { session: false }), GetDanhSachTheoTenKhachHang);
//http://localhost:3000/api/khachhang/danhgia/get-theo-id/65ceb821bf407aaa4e0a3fb9
router.get("/get-theo-id/:idDanhGia", passport.authenticate('jwt', { session: false }), GetDanhGiaTheoId);
//http://localhost:3000/api/khachhang/danhgia/get-so-luong-theo-mon/65cc2e72557054378b5490ad
router.get("/get-so-luong-theo-mon/:idMon", passport.authenticate('jwt', { session: false }), getTatCaDanhGiaTheoMonApi);
// http://localhost:3000/api/khachhang/danhgia/get-so-luong-theo-khach-hang/65cc2e72557054378b5490ad
router.get("/get-so-luong-theo-khach-hang/:idKH", passport.authenticate('jwt', { session: false }), GetSoLuongDanhGiaTheoKhachHang);

router.get("/get-danh-sach-theo-mon-filter/:idMon", passport.authenticate('jwt', { session: false }), GetDanhSachDanhGiaTheoMonVoiFilterApi);

router.get("/get-trung-binh/:idMon", passport.authenticate('jwt', { session: false }), getTrungBinhDanhGiaApi);

module.exports = router;
