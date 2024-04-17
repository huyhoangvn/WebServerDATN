var express = require('express');
var router = express.Router();
const {
  ThemKhuyenMai,
  SuaKhuyenMai,
  XoaKhuyenMai,
  xoaKhuyenMaiApi,
  GetKhuyenMaiTheoTieuDe,
  GetKhuyenMaiTheoPhanTram,
  GetKhuyenMaiTheoDonToiThieu,
  GetKhuyenMaiTheoId,
  GetKhuyenMaiTheoNgay,
  GetKhuyenMaiTheoMaKhuyenMai,
  getTatCaKhuyenMai,
  SuaKhuyenMaiApi,
  getTatCaKhuyenMaiApp,
  getTatCaKhuyenMaiAppApi,
} = require('../../../controllers/khuyenmai/khuyenmai-controller');
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// http://localhost:3000/api/nhanvien/khuyenmai/them-khuyen-mai
// body raw:
// {
//   "tieuDe":"Khuyen mãi mới thêm",
//   "ngayBatDau":"2024/03/29",
//   "ngayHetHan":"2024/04/29",
//   "phanTramKhuyeMai":20,
//   "donToiThieu":30000
// }
router.post("/them-khuyen-mai", passport.authenticate('jwt', { session: false }), ThemKhuyenMai);

// http://localhost:3000/api/nhanvien/khuyenmai/sua-khuyen-mai/65d2d024b680727a505006ae
// body raw: 
// {
//   "tieuDe":"Khuyen mãi mới thêm sau khi sửa",
//   "ngayBatDau":"2024/03/30",
//   "ngayHetHan":"2024/04/30",
//   "phanTramKhuyeMai":30,
//   "donToiThieu":50000
// }
router.put("/sua-khuyen-mai/:idKM", passport.authenticate('jwt', { session: false }), SuaKhuyenMaiApi);


// http://localhost:3000/api/nhanvien/khuyenmai/xoa-khuyen-mai/65d2d024b680727a505006ae
// chọn khuyến mãi có trạng thái true để test 
router.put("/xoa-khuyen-mai/:idKM", passport.authenticate('jwt', { session: false }), xoaKhuyenMaiApi);

// http://localhost:3000/api/nhanvien/khuyenmai/get-khuyen-mai-theo-tieu-de?tieuDe=sale&limit=1
// viết 1 từ bất kì vào query để tìm 
router.get("/get-khuyen-mai-theo-tieu-de", passport.authenticate('jwt', { session: false }), GetKhuyenMaiTheoTieuDe);

//http://localhost:3000/api/nhanvien/khuyenmai/get-khuyen-mai-theo-ma-khuyen-mai?maKhuyenMai=R0&limit=1
// Nhập kí tự viết hoa hoặc số bất kì vào query
router.get("/get-khuyen-mai-theo-ma-khuyen-mai", passport.authenticate('jwt', { session: false }), GetKhuyenMaiTheoMaKhuyenMai);

// http://localhost:3000/api/nhanvien/khuyenmai/get-khuyen-mai-theo-phan-tram?phanTramKhuyenMai=10&limit=1
// nhập 1 số bất kì từ 1-50 vào query để tìm 
router.get("/get-khuyen-mai-theo-phan-tram", passport.authenticate('jwt', { session: false }), GetKhuyenMaiTheoPhanTram);

// http://localhost:3000/api/nhanvien/khuyenmai/get-khuyen-mai-theo-don-toi-thieu?donToiThieu=30000&limit=1
// nhập 1 giá bất kỳ vào query dể tìm 
router.get("/get-khuyen-mai-theo-don-toi-thieu", passport.authenticate('jwt', { session: false }), GetKhuyenMaiTheoDonToiThieu);

// http://localhost:3000/api/nhanvien/khuyenmai/get-khuyen-mai-theo-id/65d311af225a87ed44905a52
//nhập idKM trên url 
router.get("/get-khuyen-mai-theo-id/:idKM", passport.authenticate('jwt', { session: false }), GetKhuyenMaiTheoId);

//http://localhost:3000/api/nhanvien/khuyenmai/get-khuyen-mai-theo-ngay?ngayCanTim=2024/03/30
// nhập ngày bất kỳ vào query để tìm 
router.get("/get-khuyen-mai-theo-ngay", passport.authenticate('jwt', { session: false }), GetKhuyenMaiTheoNgay);

router.get("/get-tat-ca-khuyen-mai", passport.authenticate('jwt', { session: false }), getTatCaKhuyenMai);

router.get("/khuyen-mai", passport.authenticate('jwt', { session: false }), getTatCaKhuyenMaiAppApi);



module.exports = router;
