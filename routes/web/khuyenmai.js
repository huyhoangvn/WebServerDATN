var express = require('express');
var router = express.Router();
var KhuyenMaiCtrl = require("../../controllers/khuyenmai/khuyen-mai-web-controller");

router.get('/danh-sach',  KhuyenMaiCtrl.getList);

router.get('/them-moi',  KhuyenMaiCtrl.getViewAdd);

router.post('/ADD',  KhuyenMaiCtrl.getAdd);

router.post('/sua/:idKM',  KhuyenMaiCtrl.updateKhuyenMai)

router.post('/sua-trang-thai/:idKM',  KhuyenMaiCtrl.updateTrangThai)

module.exports = router;
