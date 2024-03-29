var express = require('express');
var router = express.Router();
var GioHangCtrl = require("../../../controllers/giohang/giohang-controller");

/* GET users listing. */
router.post('/', GioHangCtrl.addGioHangApi);
router.delete('/detele/:id', GioHangCtrl.deleteGioHangApi);
router.get('/', GioHangCtrl.getAllGioHangApi);
router.get('/get-gio-hang-by-id/:id', GioHangCtrl.getGioHangByUserIdApi);
module.exports = router;
