var express = require('express');
var router = express.Router();
const hoadonctrl = require('../../../controllers/hoadon/hoadon-controller')
/* GET users listing. */
router.post('/add', hoadonctrl.addHoaDonApi);
// get all 
router.get('/', hoadonctrl.getHoaDonApi);

router.get('/khach-hang/:id', hoadonctrl.getDanhSachHoaDonByIdKhachHangApi);

router.get('/cua-hang/:id', hoadonctrl.getDanhSachHoaDonByIdCuaHangApi);
// delete 
router.delete('delete/:id', hoadonctrl.deleteHoaDonApi);
//update
router.put('/update/:id', hoadonctrl.updateHoaDonApi);
// update trang thái xác nhận khách hàng
router.post('/thanh-toan/:id', hoadonctrl.updatetrangThaiThanhToanApi);
router.post('/dang-chuan-bi/:id', hoadonctrl.updatetrangThaiMuaDangChuanBiApi);
router.post('/dang-giao-hang/:id', hoadonctrl.updatetrangThaiMuaDangGiaoHangApi);
router.post('/giao-hang-that-bai/:id', hoadonctrl.updatetrangThaiMuaGiaoHangThatBaiApi);
router.post('/giao-hang-thanh-cong/:id', hoadonctrl.updatetrangThaiMuaGiaoHangThanhCongApi);

module.exports = router;