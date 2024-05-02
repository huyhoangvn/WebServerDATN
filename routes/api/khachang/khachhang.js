var express = require('express');
var router = express.Router();
var multer = require("./../../../config/multer-config");
var KhachHangCtrl = require("../../../controllers/khachhang/khachhang-controller");

/* GET users listing. */

router.get('/thong-tin/:id',  KhachHangCtrl.getKhachHangbyidKhachHang);

router.post('/doi-mat-khau/:id',  KhachHangCtrl.updateMatKhau);

router.put("/:idKH",  multer.upload.fields([{ name: 'hinhAnh', maxCount: 1 }]), KhachHangCtrl.updateKhachHang); //http://localhost:3000/api/khachhang/khachhang/updateKhachHang



module.exports = router;
