var express = require('express');
var router = express.Router();
var MonCtrl = require("../../controllers/mon/mon-web-controller");

router.get('/danh-sach',  MonCtrl.getList);
// router.get('/chi-tiet/:idMon',sessionAdmin.setTokenHeader, passport.authenticate('jwt', {session : false}), ()=>{ res.end("Chi tiết") });
router.get('/chi-tiet/:idMon',  MonCtrl.getChiTietMon);
router.get('/sua-trang-thai/:idMon',  MonCtrl.xoaMon);
router.get('/xoa-danh-gia/:idDG',  MonCtrl.xoaDanhGia);


module.exports = router;
