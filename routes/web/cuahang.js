var express = require('express');
var router = express.Router();
var CuaHangCtrl = require("../../controllers/cuahang/cua-hang-web-controller");
var MonCtrl = require("../../controllers/mon/mon-web-controller");

router.get('/danh-sach',  CuaHangCtrl.getList);
router.get('/them-moi',  CuaHangCtrl.getAddView);
router.post('/add',  CuaHangCtrl.getAdd);
router.get('/chi-tiet/:idCH',  CuaHangCtrl.chiTietCuaHang);
router.get('/sua-trang-thai/:idCH',  CuaHangCtrl.xoaCuaHang);

router.post('/them-nv/:idCH',  CuaHangCtrl.themNhanVienQuanLy);

router.post('/sua-trang-thai/:idNV',  CuaHangCtrl.xoaNhanVien);
router.get('/xoa-mon/:idMon', CuaHangCtrl.xoaMon);

module.exports = router;