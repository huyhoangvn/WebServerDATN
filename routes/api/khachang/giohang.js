var express = require('express');
var router = express.Router();
var GioHangCtrl = require("../../../controllers/giohang/giohang-controller");

/* GET users listing. */
router.post('/them/:idKH', GioHangCtrl.addGioHang);
router.delete('/delete/:id', GioHangCtrl.deleteGioHang);
router.get('/danh-sach/:idKH', GioHangCtrl.getAllGioHangApi);
// router.get('/:idKH', GioHangCtrl.getGioHangByUserIdApi);

router.post('/isMonExist/:idKH', GioHangCtrl.kiemTraGioHang);
module.exports = router;
