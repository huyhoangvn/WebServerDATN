var express = require('express');
var router = express.Router();

const hoadonctrl = require('../../../controllers/hoadon/hoadon-controller-api');
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

router.get('/:idKH', passport.authenticate('jwt', { session: false }), hoadonctrl.getDanhSachHoaDonByIdKhachHangApi);


router.get('/detail/:id', passport.authenticate('jwt', { session: false }), hoadonctrl.chiTietHoaDonApi);

router.delete('/delete/:idHD', passport.authenticate('jwt', { session: false }), hoadonctrl.deleteHoaDonApi); // hủy 

module.exports = router;
