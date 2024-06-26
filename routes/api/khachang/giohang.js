var express = require('express');
var router = express.Router();
var GioHangCtrl = require("../../../controllers/giohang/giohang-controller");


/* GET users listing. */
router.post('/them/:idKH',  GioHangCtrl.addGioHang);
router.delete('/delete/:idKH',  GioHangCtrl.deleteGioHang);
router.get('/danh-sach/:idKH',  GioHangCtrl.getAllGioHangApi);


router.post('/isMonExist/:idKH',  GioHangCtrl.kiemTraGioHang);
module.exports = router;
