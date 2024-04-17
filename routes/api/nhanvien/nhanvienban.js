var express = require('express');
var router = express.Router();
const nhanvienbanController = require('../../../controllers/nhanvien/nhanvienban-controller');
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')
/* GET users listing. */
router.get('/:idCuaHang', passport.authenticate('jwt', { session: false }), nhanvienbanController.getListNhanVienApi);

router.post('/', passport.authenticate('jwt', { session: false }), nhanvienbanController.addNhanVienApi);

router.put('/:id', passport.authenticate('jwt', { session: false }), nhanvienbanController.updateNhanVienApi)

router.delete('/:id', passport.authenticate('jwt', { session: false }), nhanvienbanController.deleteNhanVienApi);

router.post('/doi-mat-khau/:id', passport.authenticate('jwt', { session: false }), nhanvienbanController.doiMatKhauApi);

router.get('/chi-tiet-nhan-vien/:id', passport.authenticate('jwt', { session: false }), nhanvienbanController.chiTietNhanVienApi);

module.exports = router;