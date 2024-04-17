var express = require('express');
var router = express.Router();

var CuaHangCtr = require("../../../controllers/cuahang/cuahang-controller");
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')
/* GET users listing. */
router.get('/chi-tiet/:id', passport.authenticate('jwt', { session: false }), CuaHangCtr.chiTietCuaHangAppApi);

module.exports = router;
