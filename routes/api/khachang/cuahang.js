var express = require('express');
var router = express.Router();

var CuaHangCtr = require("../../../controllers/cuahang/cuahang-controller");
/* GET users listing. */
router.get('/chi-tiet/:id', CuaHangCtr.chiTietCuaHangAppApi);

module.exports = router;
