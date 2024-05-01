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

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.end(JSON.stringify({
    message: 'Binh luan thành công'
  }));
});

// http://localhost:3000/api/khachhang/danhgia/them/65cc2e9d557054378b5490b2/65cc2e72557054378b5490ad
router.post("/them/:idKH/:idMon",  ThemDanhGia);
// http://localhost:3000/api/khachhang/danhgia/sua/65cc2e9d557054378b5490b2/65cc2e72557054378b5490ad
router.put("/sua/:idDG",  SuaDanhGia);
// http://localhost:3000/api/khachhang/danhgia/xoa/65cc2e9d557054378b5490b2/65cc2e72557054378b5490ad
router.put("/xoa/:idDG",  XoaDanhGia);
// http://localhost:3000/api/khachhang/danhgia/get-theo-ten-mon/65cc2e72557054378b5490ad
router.get("/get-theo-ten-mon/:idMon",  GetDanhSachTheoTenMon);
// http://localhost:3000/api/khachhang/danhgia/get-theo-ten-khach-hang/65cc2e9d557054378b5490b2
router.get("/get-theo-ten-khach-hang/:idKH",  GetDanhSachTheoTenKhachHang);
//http://localhost:3000/api/khachhang/danhgia/get-theo-id/65ceb821bf407aaa4e0a3fb9
router.get("/get-theo-id/:idDanhGia",  GetDanhGiaTheoId);
//http://localhost:3000/api/khachhang/danhgia/get-so-luong-theo-mon/65cc2e72557054378b5490ad
router.get("/get-so-luong-theo-mon/:idMon",  getTatCaDanhGiaTheoMonApi);
// http://localhost:3000/api/khachhang/danhgia/get-so-luong-theo-khach-hang/65cc2e72557054378b5490ad
router.get("/get-so-luong-theo-khach-hang/:idKH",  GetSoLuongDanhGiaTheoKhachHang);

router.get("/get-danh-sach-theo-mon-filter/:idMon",  GetDanhSachDanhGiaTheoMonVoiFilterApi);

router.get("/get-trung-binh/:idMon",  getTrungBinhDanhGiaApi);

module.exports = router;
