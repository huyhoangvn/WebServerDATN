var express = require('express');
var router = express.Router();
var HoaDonCtrl = require("../../controllers/hoadon/hoa-don-web-controller");

router.get('/danh-sach',  HoaDonCtrl.getList);

router.get('/chi-tiet/:id',  HoaDonCtrl.getChiTiet);

module.exports = router;