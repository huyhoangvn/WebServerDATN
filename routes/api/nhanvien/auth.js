var express = require('express');
var router = express.Router();
var NhanVienDangNhapCtrl = require("../../../controllers/nhanvien/dangnhap-controller");

router.post('/', NhanVienDangNhapCtrl.dangNhapApi);
 
module.exports = router;
