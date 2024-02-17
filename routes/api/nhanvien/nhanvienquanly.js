var express = require('express');
var router = express.Router();
const nhanVienQuanLyController = require('../../../controllers/nhanvien/nhanvienquanly-controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/them-nhanvien-ban/:id', nhanVienQuanLyController.addNhanVienBanApi)
router.put('/sua-nhanvien-ban/:id/:idNhanVienBan', nhanVienQuanLyController.suaNhanVienBanApi)

router.post('/xoa-nhan-vien-ban/:id/:idNhanVienBan', nhanVienQuanLyController.xoaNhanVienBanApi)
router.post('/kich-hoat-nhan-vien-ban/:id/:idNhanVienBan', nhanVienQuanLyController.kichHoatnhanVienBanApi)



module.exports = router;