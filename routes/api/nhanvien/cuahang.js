var express = require('express');
var router = express.Router();
var CuaHangCtr = require("../../../controllers/cuahang/cuahang-controller");

/* GET users listing. */
router.get('/', CuaHangCtr.getCuaHangCuaHangApi);
router.post('/', CuaHangCtr.addCuaHangApi);
router.put('/:id', CuaHangCtr.updateCuaHangApi);

router.post('/kich-hoat/:id', CuaHangCtr.kichHoatCuaHangApi);

router.delete('/huy-kich-hoat/:id', CuaHangCtr.huyKichHoatCuaHangApi);

router.get('/chi-tiet/:id', CuaHangCtr.chiTietCuaHangApi);

module.exports = router;
