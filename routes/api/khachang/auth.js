var express = require('express');
var router = express.Router();
var KhachHangCtrl = require("../../../controller/authKhachHang.ctrl");

/* GET users listing. */
router.post('/', KhachHangCtrl.dangKyApi);

module.exports = router;
