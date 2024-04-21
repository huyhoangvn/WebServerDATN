var express = require('express');
var router = express.Router();
var khuyenmaictCtl = require('../../../controllers/khuyenmaicuatoi/khuyen-mai-cua-toi-controller');
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')


router.post('/:idKM', passport.authenticate('jwt', { session: false }), khuyenmaictCtl.addKMCuaToiApi);
router.delete('/:id', passport.authenticate('jwt', { session: false }), khuyenmaictCtl.deleteKhuyenMaiCTApi);
router.get('/danh-sach/:idKH', passport.authenticate('jwt', { session: false }), khuyenmaictCtl.getAllKhuyenMaiCTApi);


module.exports = router;