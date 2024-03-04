var express = require('express');
var router = express.Router();
const {
  ThemKhuyenMai,
  SuaKhuyenMai,
  XoaKhuyenMai,
  GetKhuyenMaiTheoTieuDe,
  GetKhuyenMaiTheoPhanTram,
  GetKhuyenMaiTheoDonToiThieu,
  GetKhuyenMaiTheoId,
  GetKhuyenMaiTheoNgay,
  GetKhuyenMaiTheoNoiDung
  } = require('../../../controllers/khuyenmai/khuyenmai-controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// http://localhost:3000/api/nhanvien/khuyenmai/them-khuyen-mai
router.post("/them-khuyen-mai",ThemKhuyenMai);
// http://localhost:3000/api/nhanvien/khuyenmai/sua-khuyen-mai/65d2d024b680727a505006ae
router.put("/sua-khuyen-mai/:idKM",SuaKhuyenMai);
// http://localhost:3000/api/nhanvien/khuyenmai/xoa-khuyen-mai/65d2d024b680727a505006ae
router.put("/xoa-khuyen-mai/:idKM",XoaKhuyenMai);
// http://localhost:3000/api/nhanvien/khuyenmai/get-khuyen-mai-theo-tieu-de?tieuDe=sale?limit=1
router.get("/get-khuyen-mai-theo-tieu-de",GetKhuyenMaiTheoTieuDe);
//http://localhost:3000/api/nhanvien/khuyenmai/get-khuyen-mai-theo-noi-dung?noiDung=ăn&limit=1
router.get("/get-khuyen-mai-theo-noi-dung",GetKhuyenMaiTheoNoiDung);
// http://localhost:3000/api/nhanvien/khuyenmai/get-khuyen-mai-theo-phan-tram?phanTramKhuyenMai=10&limit=1
router.get("/get-khuyen-mai-theo-phan-tram",GetKhuyenMaiTheoPhanTram);
// http://localhost:3000/api/nhanvien/khuyenmai/get-khuyen-mai-theo-don-toi-thieu?donToiThieu=30000&limit=1
router.get("/get-khuyen-mai-theo-don-toi-thieu",GetKhuyenMaiTheoDonToiThieu);
// http://localhost:3000/api/nhanvien/khuyenmai/get-khuyen-mai-theo-id/65d311af225a87ed44905a52
router.get("/get-khuyen-mai-theo-id/:idKM",GetKhuyenMaiTheoId);
//đang gặp 1 vài vấn đề sẽ fix nốt 
router.get("/get-khuyen-mai-theo-ngay",GetKhuyenMaiTheoNgay);



module.exports = router;
