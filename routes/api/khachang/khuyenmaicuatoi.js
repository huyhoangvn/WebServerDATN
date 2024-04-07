var express = require('express');
var router = express.Router();
var khuyenmaictCtl = require('../../../controllers/khuyenmaicuatoi/khuyen-mai-cua-toi-controller');


router.post('/:idKM', khuyenmaictCtl.addKMCuaToiApi);
router.delete('/:id', khuyenmaictCtl.deleteKhuyenMaiCTApi);
router.get('/danh-sach', khuyenmaictCtl.getAllKhuyenMaiCTApi);


module.exports = router;