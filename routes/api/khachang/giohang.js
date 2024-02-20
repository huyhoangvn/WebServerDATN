var express = require('express');
var router = express.Router();
var GioHangCtrl  =require("../../../controllers/giohang/giohang-controller");

/* GET users listing. */
router.post('/add-gio-hang', GioHangCtrl.addGioHangApi);
router.put('/update-gio-hang',GioHangCtrl.updateGioHangApi);
router.delete('/soft-gio-hang',GioHangCtrl.softDeleteGioHangApi);
router.delete('/detele-gio-hang/:id',GioHangCtrl.deleteGioHangApi);
router.get('/get-all-gio-hang',GioHangCtrl.getAllGioHangApi);
router.get('/get-gio-hang-by-id/:id',GioHangCtrl.getGioHangByUserIdApi);
module.exports = router;
