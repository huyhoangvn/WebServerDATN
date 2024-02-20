var express = require('express');
var router = express.Router();
var KhachHangCtrl = require("../../../controller-example/authKhachHang.ctrl");
const passport = require('passport')
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const sessionAdmin = require('../../../config/auth/session-admin')

/* GET users listing. */
router.post('/', KhachHangCtrl.dangKyApi);
router.post('/dang-nhap', KhachHangCtrl.dangNhapApi);
router.get('/', sessionAdmin.setTokenHeader , passport.authenticate('jwt', {session : false}), KhachHangCtrl.layDanhSachApi)
router.get('/log-out', (req, res, next)=>{
    req.session.token = ""
    res.json({
        success: true,
        msg: "Thành công"
    })
})

 
module.exports = router;
