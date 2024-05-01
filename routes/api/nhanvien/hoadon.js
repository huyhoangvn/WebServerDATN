var express = require('express');
var router = express.Router();
const hoadonctrl = require('../../../controllers/hoadon/hoadon-controller-api')

/* GET users listing. */
// router.post('/add', hoadonctrl.addHoaDonApi);
// get all 
router.get('/',  hoadonctrl.getHoaDonApi);

router.get('/:id',  hoadonctrl.chiTietHoaDonApi);

router.get('/khachhang/:idKH',  hoadonctrl.getDanhSachHoaDonByIdKhachHangApi);

router.get('/cuahang/:idCH',  hoadonctrl.getDanhSachHoaDonByIdCuaHangApi);
// delete 

router.delete('/delete-cung/:idHD',  hoadonctrl.deleteHoaDonCungApi);

//update
router.put('/update/:id',  hoadonctrl.updateHoaDonApi);
// update trang thái xác nhận khách hàng
router.post('/thanh-toan/:id',  hoadonctrl.updatetrangThaiThanhToanApi);
router.post('/dang-chuan-bi/:id',  hoadonctrl.updatetrangThaiMuaDangChuanBiApi);
router.post('/dang-giao-hang/:id',  hoadonctrl.updatetrangThaiMuaDangGiaoHangApi);
router.post('/giao-hang-that-bai/:id',  hoadonctrl.updatetrangThaiMuaGiaoHangThatBaiApi);
router.post('/giao-hang-thanh-cong/:id',  hoadonctrl.updatetrangThaiMuaGiaoHangThanhCongApi);
router.post('/delete/:id',  hoadonctrl.deleteHoaDonApi);

router.post('/thanh-cong/:id',  hoadonctrl.xacNhanThanhToanThanhCongApi);
router.post('/that-bai/:id',  hoadonctrl.xacNhanThanhToanThatBaiApi);


module.exports = router;