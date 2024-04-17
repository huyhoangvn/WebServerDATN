var express = require('express');
var router = express.Router();
const hoadonctrl = require('../../../controllers/hoadon/hoadon-controller-api')
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')

/* GET users listing. */
// router.post('/add', hoadonctrl.addHoaDonApi);
// get all 
router.get('/', passport.authenticate('jwt', { session: false }), hoadonctrl.getHoaDonApi);

router.get('/:id', passport.authenticate('jwt', { session: false }), hoadonctrl.chiTietHoaDonApi);

router.get('/khachhang/:idKH', passport.authenticate('jwt', { session: false }), hoadonctrl.getDanhSachHoaDonByIdKhachHangApi);

router.get('/cuahang/:idCH', passport.authenticate('jwt', { session: false }), hoadonctrl.getDanhSachHoaDonByIdCuaHangApi);
// delete 

router.delete('/delete-cung/:idHD', passport.authenticate('jwt', { session: false }), hoadonctrl.deleteHoaDonCungApi);

//update
router.put('/update/:id', passport.authenticate('jwt', { session: false }), hoadonctrl.updateHoaDonApi);
// update trang thái xác nhận khách hàng
router.post('/thanh-toan/:id', passport.authenticate('jwt', { session: false }), hoadonctrl.updatetrangThaiThanhToanApi);
router.post('/dang-chuan-bi/:id', passport.authenticate('jwt', { session: false }), hoadonctrl.updatetrangThaiMuaDangChuanBiApi);
router.post('/dang-giao-hang/:id', passport.authenticate('jwt', { session: false }), hoadonctrl.updatetrangThaiMuaDangGiaoHangApi);
router.post('/giao-hang-that-bai/:id', passport.authenticate('jwt', { session: false }), hoadonctrl.updatetrangThaiMuaGiaoHangThatBaiApi);
router.post('/giao-hang-thanh-cong/:id', passport.authenticate('jwt', { session: false }), hoadonctrl.updatetrangThaiMuaGiaoHangThanhCongApi);
router.post('/delete/:id', passport.authenticate('jwt', { session: false }), hoadonctrl.deleteHoaDonApi);


module.exports = router;