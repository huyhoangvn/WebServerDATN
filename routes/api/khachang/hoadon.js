var express = require('express');
var router = express.Router();

const hoadonctrl = require('../../../controllers/hoadon/hoadon-controller-api')

router.get('/khach-hang/:idKH', hoadonctrl.getDanhSachHoaDonByIdKhachHangApi);

router.post('/add', hoadonctrl.addHoaDonApi);

router.get('/:id', hoadonctrl.chiTietHoaDonApi);

router.post('/delete/:id', hoadonctrl.deleteHoaDonApi); // hủy 

module.exports = router;
