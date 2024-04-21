var express = require('express');
var router = express.Router();
var multer = require("./../../../config/multer-config");
var KhachHangCtrl = require("../../../controllers/khachhang/khachhang-controller");
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

/* GET users listing. */
router.post('/dang-ky', passport.authenticate('jwt', { session: false }), KhachHangCtrl.dangKyApi); //http://localhost:3000/api/khachhang/khachhang/dangKy
router.post('/dang-nhap', passport.authenticate('jwt', { session: false }), KhachHangCtrl.dangNhap); //http://localhost:3000/api/khachhang/khachhang/dangNhap

router.get('/thong-tin/:id', passport.authenticate('jwt', { session: false }), KhachHangCtrl.getKhachHangbyidKhachHang);

router.post('/doi-mat-khau/:id', passport.authenticate('jwt', { session: false }), KhachHangCtrl.updateMatKhau);

router.put("/:idKH", passport.authenticate('jwt', { session: false }), multer.upload.fields([{ name: 'hinhAnh', maxCount: 1 }]), KhachHangCtrl.updateKhachHang); //http://localhost:3000/api/khachhang/khachhang/updateKhachHang

router.post('/find-account/:email', KhachHangCtrl.finAccount); //http://localhost:3000/api/khachhang/khachhang/find-account

router.put('/forgot-password/:id', KhachHangCtrl.forgotPassword); //http://localhost:3000/api/khachhang/khachhang/forgot-password

module.exports = router;
