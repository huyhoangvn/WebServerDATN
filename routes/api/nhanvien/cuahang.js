var express = require('express');
var router = express.Router();
const MulterConfigs = require("../../../config/multer-config");

var CuaHangCtr = require("../../../controllers/cuahang/cuahang-controller");
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')

/* GET users listing. */
router.get('/', passport.authenticate('jwt', { session: false }), CuaHangCtr.getCuaHang);
router.post('/', passport.authenticate('jwt', { session: false }), CuaHangCtr.addCuaHang);
router.put('/:id', passport.authenticate('jwt', { session: false }), MulterConfigs.upload.array('hinhAnh', 1), CuaHangCtr.updateCuaHangApi);

router.post('/kich-hoat/:id', passport.authenticate('jwt', { session: false }), CuaHangCtr.kichHoatCuaHangApi);

router.delete('/huy-kich-hoat/:id', passport.authenticate('jwt', { session: false }), CuaHangCtr.huyKichHoatCuaHangApi);

router.get('/chi-tiet/:id', passport.authenticate('jwt', { session: false }), CuaHangCtr.chiTietCuaHangAppApi);


module.exports = router;
