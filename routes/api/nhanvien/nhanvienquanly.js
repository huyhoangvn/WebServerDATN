var express = require('express');
var router = express.Router();
const nhanVienQuanLyController = require('../../../controllers/nhanvien/nhanvienquanly-controller');
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const MulterConfigs = require("../../../config/multer-config");
const passport = require('passport')

/* GET users listing. */
router.get('/', passport.authenticate('jwt', { session: false }), nhanVienQuanLyController.getListNhanVienQuanlyApi);// -> web
router.post('/', nhanVienQuanLyController.addNhanVienQuanLy)//-> cả web cả api
// router.delete('/:id',nhanVienQuanLyController.xoaCungNhanVienQuanLyApi);//-> web
// router.put('/:id',nhanVienQuanLyController.updateNhanvienQuanLyApi)//-> web nếu trạng thái 1 (Đã duyệt rồi)
router.put('/:id', nhanVienQuanLyController.updateNhanvienQuanLyApi)//-> api nếu trạng thái 0 (Chưa duyệt)

// router.post('/sua-cua-hang/:id',nhanVienQuanLyController.updateCuahangApi)// -> web nếu trạng thái 1 (Đã duyệt rồi)
router.post('/sua-cua-hang/:id', nhanVienQuanLyController.updateCuahangApi)// -> api nếu trạng thái 0 (Chưa duyệt)
router.post('/doi-mat-khau/:id', nhanVienQuanLyController.updateMatKhauApi)// -> api
// router.post('/xoa-nhan-vien-quanly/:id', nhanVienQuanLyController.xoaNhanVienQuanLyApi)// -> web
// router.post('/kich-hoat-nhan-vien-quanly/:id', nhanVienQuanLyController.kichHoatnhanVienQuanLyApi)// -> web
router.get('/chi-tiet-nhan-vien/:id', nhanVienQuanLyController.chiTietNhanVienQuanLyApi);// -> cả web và api

router.post('/them-nhanvien-ban/:id', nhanVienQuanLyController.addNhanVienBanApi)//->api
router.put('/sua-nhanvien-ban/:id/:idNhanVienBan', MulterConfigs.upload.array('hinhAnh', 1), nhanVienQuanLyController.suaNhanVienBanApi)//->api
router.post('/huy-kich-hoat-nhan-vien-ban/:id/:idNhanVienBan', nhanVienQuanLyController.huyKichHoatNhanVienApi)//->api

module.exports = router;