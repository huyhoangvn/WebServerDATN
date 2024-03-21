var express = require('express');
var router = express.Router();
const nhanVienQuanLyController = require('../../../controllers/nhanvien/nhanvienquanly-controller');
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

/* GET users listing. */
router.get('/',passport.authenticate('jwt', {session : false}), nhanVienQuanLyController.getListNhanVienQuanlyApi);// -> web
router.post('/',nhanVienQuanLyController.addNhanVienQuanLyApi)//-> cả web cả api
// router.delete('/:id',nhanVienQuanLyController.xoaCungNhanVienQuanLyApi);//-> web
// router.put('/:id',nhanVienQuanLyController.updateNhanvienQuanLyApi)//-> web nếu trạng thái 1 (Đã duyệt rồi)
router.put('/:id',nhanVienQuanLyController.updateNhanvienQuanLyApi)//-> api nếu trạng thái 0 (Chưa duyệt)

// router.post('/sua-cua-hang/:id',nhanVienQuanLyController.updateCuahangApi)// -> web nếu trạng thái 1 (Đã duyệt rồi)
router.post('/sua-cua-hang/:id',nhanVienQuanLyController.updateCuahangApi)// -> api nếu trạng thái 0 (Chưa duyệt)
router.post('/doi-mat-khau/:id',nhanVienQuanLyController.updateMatKhauApi)// -> api
// router.post('/xoa-nhan-vien-quanly/:id', nhanVienQuanLyController.xoaNhanVienQuanLyApi)// -> web
// router.post('/kich-hoat-nhan-vien-quanly/:id', nhanVienQuanLyController.kichHoatnhanVienQuanLyApi)// -> web
router.get('/chi-tiet-nhan-vien-quanly/:id',nhanVienQuanLyController.chiTietNhanVienQuanLyApi);// -> cả web và api

router.post('/them-nhanvien-ban/:id', nhanVienQuanLyController.addNhanVienBanApi)//->api
router.put('/sua-nhanvien-ban/:id/:idNhanVienBan', nhanVienQuanLyController.suaNhanVienBanApi)//->api
router.post('/xoa-nhan-vien-ban/:id/:idNhanVienBan', nhanVienQuanLyController.xoaNhanVienBanApi)//->api
router.post('/kich-hoat-nhan-vien-ban/:id/:idNhanVienBan', nhanVienQuanLyController.kichHoatnhanVienBanApi)//->api

module.exports = router;