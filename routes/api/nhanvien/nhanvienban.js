var express = require('express');
var router = express.Router();
const nhanvienbanController = require('../../../controllers/nhanvien/nhanvienban-controller');
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')
/* GET users listing. */
router.get('/:idCuaHang',  nhanvienbanController.getListNhanVienApi);

router.post('/',  nhanvienbanController.addNhanVienApi);

router.put('/:id',  nhanvienbanController.updateNhanVienApi)

router.delete('/:id',  nhanvienbanController.deleteNhanVienApi);

router.post('/doi-mat-khau/:id',  nhanvienbanController.doiMatKhauApi);

router.get('/chi-tiet-nhan-vien/:id',  nhanvienbanController.chiTietNhanVienApi);

module.exports = router;