var express = require('express');
var router = express.Router();
var NhanVienQuanlyCtrl = require("../../controllers/nhanvien/quan-ly-web-controller");

router.get('/danh-sach',  NhanVienQuanlyCtrl.getList);
router.get('/duyet/:idNV',  NhanVienQuanlyCtrl.duyetNhanVienQuanLy);
router.get('/sua-trang-thai/:idNV',  NhanVienQuanlyCtrl.xoaNhanVien);
module.exports = router;
