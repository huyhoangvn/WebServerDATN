var express = require('express');
var router = express.Router();
var GioHangCtrl = require("../../../controllers/giohang/giohang-controller");

/* GET users listing. */
router.post('/them/:idKH', GioHangCtrl.addGioHangApi);
router.delete('/detele/:id', GioHangCtrl.deleteGioHangApi);
router.get('/danh-sach', GioHangCtrl.getAllGioHangApi);
router.get('/:idKH', GioHangCtrl.getGioHangByUserIdApi);

router.get('/isMonExist/:idKH', GioHangCtrl.kiemTraGioHang);
module.exports = router;
