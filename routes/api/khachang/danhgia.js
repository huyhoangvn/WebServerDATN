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
  GetSoLuongDanhGiaTheoMonVoiFilterApi} = require('../../../controllers/danhgia/danhgia-controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.end(JSON.stringify({
    message:'Binh luan thành công'
  }));
});

// http://localhost:3000/api/khachhang/danhgia/them-danh-gia/65cc2e9d557054378b5490b2/65cc2e72557054378b5490ad
router.post("/them-danh-gia/:idKH/:idMon",ThemDanhGia);
// http://localhost:3000/api/khachhang/danhgia/sua-danh-gia/65cc2e9d557054378b5490b2/65cc2e72557054378b5490ad
router.put("/sua-danh-gia/:idDG",SuaDanhGia);
// http://localhost:3000/api/khachhang/danhgia/xoa-danh-gia/65cc2e9d557054378b5490b2/65cc2e72557054378b5490ad
router.put("/xoa-danh-gia/:idKH/:idMon",XoaDanhGia);
// http://localhost:3000/api/khachhang/danhgia/get-danh-gia-theo-ten-mon/65cc2e72557054378b5490ad
router.get("/get-danh-gia-theo-ten-mon/:idMon",GetDanhSachTheoTenMon);
// http://localhost:3000/api/khachhang/danhgia/get-danh-gia-theo-ten-khach-hang/65cc2e9d557054378b5490b2
router.get("/get-danh-gia-theo-ten-khach-hang/:idKH",GetDanhSachTheoTenKhachHang);
//http://localhost:3000/api/khachhang/danhgia/get-danh-gia-theo-id/65ceb821bf407aaa4e0a3fb9
router.get("/get-danh-gia-theo-id/:idDanhGia",GetDanhGiaTheoId);
//http://localhost:3000/api/khachhang/danhgia/get-so-luong-danh-gia-theo-mon/65cc2e72557054378b5490ad
router.get("/get-so-luong-danh-gia-theo-mon/:idMon",getTatCaDanhGiaTheoMonApi);
// http://localhost:3000/api/khachhang/danhgia/get-so-luong-danh-gia-theo-khach-hang/65cc2e72557054378b5490ad
router.get("/get-so-luong-danh-gia-theo-khach-hang/:idKH",GetSoLuongDanhGiaTheoKhachHang);

router.get("/get-so-luong-danh-gia-theo-mon-filter/:idMon",GetSoLuongDanhGiaTheoMonVoiFilterApi);

module.exports = router;
