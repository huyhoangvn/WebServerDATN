var express = require('express');
var router = express.Router();
var KhachHangCtrl = require("../../../controllers/khachhang/khachhang-controller");

/* GET users listing. */
router.post('/dangKy', KhachHangCtrl.dangKyApi);
router.post('/dangNhap',KhachHangCtrl.dangNhap);
router.get('/getKhachHang',KhachHangCtrl.getKhachHang);
router.put('/updateKhachHang/:id',KhachHangCtrl.updateKhachHang);
router.delete('/deleteKhachHang/:id',KhachHangCtrl.deleteKhachHang);
module.exports = router;
