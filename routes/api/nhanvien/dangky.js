var express = require('express');
var router = express.Router();
const nhanVienQuanLyController = require('../../../controllers/nhanvien/nhanvienquanly-controller');
const CuaHangCtr = require("../../../controllers/cuahang/cuahang-controller");

/* GET users listing. */
router.post('/nhanvien',  nhanVienQuanLyController.addNhanVienQuanLy)//-> cả web cả api
router.post('/cuahang',  CuaHangCtr.addCuaHang);

module.exports = router;