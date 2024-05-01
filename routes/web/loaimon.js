var express = require('express');
var router = express.Router();
var LoaiMonCtrl = require("../../controllers/loaimon/loai-mon-web-controller");

router.get('/danh-sach',  LoaiMonCtrl.getList);
router.post('/add',  LoaiMonCtrl.AddLoaiMon);
router.get('/sua-trang-thai/:idLM',  LoaiMonCtrl.xoaLoaiMon);

module.exports = router;
