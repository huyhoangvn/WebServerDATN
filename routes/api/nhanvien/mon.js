var express = require("express");
var router = express.Router();
var multer = require("./../../../config/multer-config");
const monCtrl = require("../../../controllers/mon/mon-controller");
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')

//http://localhost:3000/api/nhanvien/mon
//body { idNV, idLM, tenMon, giaTien, hinhAnh}
//idNV có phanQuyen = 1 && trangThai = 1
router.post("/",  multer.upload.fields([{ name: 'hinhAnh', maxCount: 1 }]), monCtrl.themMonApi);

router.get("/",  monCtrl.getTatCaMonApi);
router.get("/theo-cua-hang/:idCH", monCtrl.getMonCuaCuaHang); //http://localhost:3000/api/nhanvien/mon/65edaf041b25866e0cc9e5ab
router.get("/theo-loai-mon/:idLM",  monCtrl.getMonCuaLoaiMon);
router.delete("/:idMon",  monCtrl.deletemonapi);
router.put("/:idMon",  multer.upload.fields([{ name: 'hinhAnh', maxCount: 1 }]), monCtrl.updatemonapi);
router.get("/:idMon",  monCtrl.getMonTheoid); //chi tiết món
// router.get("/danh-sach-ten-cua-hang/:idCuaHang", monCtrl.getDanhSachTenCuaHang ); 

router.post("/kich-hoat/:id",  monCtrl.kichhoatMon);

module.exports = router;
