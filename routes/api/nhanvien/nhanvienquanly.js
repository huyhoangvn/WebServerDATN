var express = require('express');
var router = express.Router();
const nhanVienQuanLyController = require('../../../controllers/nhanvien/nhanvienquanly-controller');

/* GET users listing. */
router.get('/', nhanVienQuanLyController.getListNhanVienQuanlyApi);
router.post('/',nhanVienQuanLyController.addNhanVienQuanLyApi)
router.delete('/:id',nhanVienQuanLyController.xoaCungNhanVienQuanLyApi);
router.put('/:id',nhanVienQuanLyController.updateNhanvienQuanLyApi)

router.post('/sua-cua-hang/:id',nhanVienQuanLyController.updateCuahangApi)
router.post('/doi-mat-khau/:id',nhanVienQuanLyController.updateMatKhauApi)
router.post('/xoa-nhan-vien-quanly/:id', nhanVienQuanLyController.xoaNhanVienQuanLyApi)
router.post('/kich-hoat-nhan-vien-quanly/:id', nhanVienQuanLyController.kichHoatnhanVienQuanLyApi)
router.get('/chi-tiet-nhan-vien-quanly/:id',nhanVienQuanLyController.chiTietNhanVienQuanLyApi);

router.post('/them-nhanvien-ban/:id', nhanVienQuanLyController.addNhanVienBanApi)
router.put('/sua-nhanvien-ban/:id/:idNhanVienBan', nhanVienQuanLyController.suaNhanVienBanApi)
router.post('/xoa-nhan-vien-ban/:id/:idNhanVienBan', nhanVienQuanLyController.xoaNhanVienBanApi)
router.post('/kich-hoat-nhan-vien-ban/:id/:idNhanVienBan', nhanVienQuanLyController.kichHoatnhanVienBanApi)







module.exports = router;