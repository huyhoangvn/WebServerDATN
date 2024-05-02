var express = require('express');
var router = express.Router();
const thongkeCrl = require('../../../controllers/thongke/thong-ke-controller-api');

router.get('/nam-tenLM',  thongkeCrl.thongKeMonBanChayTheoNamApi);// hàm này dùng để tìm kiếm theo năm và tháng

router.get('/mon-ban-chay',  thongkeCrl.thongKeMonBanChayApi);// hàm này dùng để tìm kiếm theo năm và tháng hàm mới

module.exports = router;