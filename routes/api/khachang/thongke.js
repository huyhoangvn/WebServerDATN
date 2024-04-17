var express = require('express');
var router = express.Router();
const thongkeCrl = require('../../../controllers/thongke/thong-ke-controller-api');
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

router.get('/nam-tenLM', passport.authenticate('jwt', { session: false }), thongkeCrl.thongKeMonBanChayTheoNamApi);// hàm này dùng để tìm kiếm theo năm và tháng

module.exports = router;