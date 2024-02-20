var express = require('express');
var router = express.Router();
const hoadonctrl = require('../../../controllers/hoadon/hoadon-controller')
/* GET users listing. */
router.post('/add', hoadonctrl.addHoaDonApi);
// get all 
router.get('/', hoadonctrl.getHoaDonApi);
// delete 
router.delete('/:id', hoadonctrl.deleteHoaDonApi);
//update
router.put('/:id', hoadonctrl.updateHoaDonApi);
// update trang thái xác nhận khách hàng
router.put('/xac-nhan-khach-hang/:id', hoadonctrl.updatexacNhanKhachHangApi);

router.put('/trang-thai-thanh-toan/:id', hoadonctrl.updateTrangThaiThanhToanApi);

router.put('trang-thai-duyet/:id', hoadonctrl.updateTrangThaiDuyetApi);

router.put('/trang-thai-giao-hang/:id', hoadonctrl.updateTrangThaiGiaoHangApi);

module.exports = router;