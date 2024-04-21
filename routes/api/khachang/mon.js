var express = require('express');
var router = express.Router();
const monCtrl = require("../../../controllers/mon/mon-controller");
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

/* GET users listing. */
router.get("/:idMon", passport.authenticate('jwt', { session: false }), monCtrl.getMonTheoid);
router.get("/", passport.authenticate('jwt', { session: false }), monCtrl.getTatCaMonApi);
router.get("/theo-cua-hang/:idCH", passport.authenticate('jwt', { session: false }), monCtrl.getMonCuaCuaHang); //http://localhost:3000/api/nhanvien/mon/65edaf041b25866e0cc9e5ab
router.put("/theo-loai-mon", passport.authenticate('jwt', { session: false }), monCtrl.getMonCuaLoaiMon);
module.exports = router;
