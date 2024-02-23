var express = require("express");
var router = express.Router();

const monCtrl = require("../../../controllers/mon/mon-controller");

/* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });
router.post("/them-mon/:id", monCtrl.addmonapi); // http://localhost:3000/api/nhanvien/mon/65d81fb5a5096f5042f92c1a
router.get("/:idCuaHang", monCtrl.getAllmonapi);
router.delete("/:idMon", monCtrl.deletemonapi); // http://localhost:3000/api/khachhang/danhgia/xoa-danh-gia/65cc2e9d557054378b5490b2/65cc2e72557054378b5490ad
router.put("/:idCH/:idNV", monCtrl.updatemonapi);
router.get("/tim-mon-theo-id/:idMon", monCtrl.getMonTheoid); //http://localhost:3000/api/nhanvien/mon/tim-mon-theo-id/65d850ca9f4a584a712daf8f/
router.get("/danh-sach-ten-cua-hang/:idCuaHang", monCtrl.getDanhSachTenCuaHang); //http://localhost:3000/api/nhanvien/mon/tim-mon-theo-id/65d850ca9f4a584a712daf8f/

router.post("/kich-hoat-mon/:id", monCtrl.kichhoatMon);

module.exports = router;
