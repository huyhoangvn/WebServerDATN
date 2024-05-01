var express = require('express');
var router = express.Router();
var khuyenmaictCtl = require('../../../controllers/khuyenmaicuatoi/khuyen-mai-cua-toi-controller');
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')


router.post('/:idKM', khuyenmaictCtl.addKMCuaToiApi);
router.delete('/:id/:idKH', khuyenmaictCtl.deleteKhuyenMaiCTApi);
router.get('/danh-sach/:idKH', khuyenmaictCtl.getAllKhuyenMaiCTApi);


module.exports = router;