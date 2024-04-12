var express = require('express');
var router = express.Router();

const hoadonctrl = require('../../../controllers/hoadon/hoadon-controller-api')

router.get('/:idKH', hoadonctrl.getDanhSachHoaDonByIdKhachHangApi);

router.post('/add', hoadonctrl.addHoaDonApi);

router.get('/detail/:id', hoadonctrl.chiTietHoaDonApi);

router.delete('/delete/:idHD', hoadonctrl.deleteHoaDonApi); // hủy 

module.exports = router;
