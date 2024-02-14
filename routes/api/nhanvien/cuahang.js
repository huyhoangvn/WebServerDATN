var express = require('express');
var router = express.Router();
const MulterConfigs = require("../../../config/multer-config");

var CuaHangCtr = require("../../../controllers/cuahang/cuahang-controller");

/* GET users listing. */
router.get('/', CuaHangCtr.getCuaHangCuaHangApi);
router.post('/', CuaHangCtr.addCuaHangApi);
router.put('/:id',MulterConfigs.upload.array('hinhAnh', 1), CuaHangCtr.updateCuaHangApi);

router.post('/kich-hoat/:id', CuaHangCtr.kichHoatCuaHangApi);

router.delete('/huy-kich-hoat/:id', CuaHangCtr.huyKichHoatCuaHangApi);

router.get('/chi-tiet/:id', CuaHangCtr.chiTietCuaHangApi);

module.exports = router;
