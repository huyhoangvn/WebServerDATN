var express = require('express');
var router = express.Router();
var KhachHangCtrl = require("../../controllers/khachhang/khach-hang-web-controller");

router.get('/danh-sach',  KhachHangCtrl.getList);
router.get('/sua-trang-thai/:idKH',  KhachHangCtrl.xoaKhachHang);

module.exports = router;
