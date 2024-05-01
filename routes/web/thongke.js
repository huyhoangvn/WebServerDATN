var express = require('express');
var router = express.Router();

var DoanhThuCtrl = require("../../controllers/thongke/doanh-thu-web-controller");
var MonBanChayCtrl = require("../../controllers/thongke/mon-ban-chay-web-controller");
var GiaoDichCtrl = require("../../controllers/thongke/giao-dich-web-controller");

const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-admin')
const sessionAdmin = require('../../config/auth/session-admin')

//

router.get('/doanh-thu', DoanhThuCtrl.getView);
router.get('/doanh-thu/theo-nam', DoanhThuCtrl.getChiTietDoanhThuTheoNam);
router.get('/doanh-thu/ngay-to-ngay', DoanhThuCtrl.thongKeDoanhThuNgayToNgay);
router.get('/mon-ban-chay', MonBanChayCtrl.getView);
router.get('/mon-ban-chay-filter', MonBanChayCtrl.getList);
router.get('/giao-dich', GiaoDichCtrl.getView);
 
module.exports = router;