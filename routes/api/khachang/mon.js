var express = require('express');
var router = express.Router();
const monCtrl = require("../../../controllers/mon/mon-controller");
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

/* GET users listing. */
router.get("/:idMon",  monCtrl.getMonTheoid);
router.get("/",  monCtrl.getTatCaMonApi);
router.get("/theo-cua-hang/:idCH",  monCtrl.getMonCuaCuaHang); //http://localhost:3000/api/nhanvien/mon/65edaf041b25866e0cc9e5ab
router.put("/theo-loai-mon",  monCtrl.getMonCuaLoaiMon);
module.exports = router;
