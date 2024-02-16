var express = require('express');
var router = express.Router();
const {ThemDanhGia,SuaDanhGia,XoaDanhGia} = require('../../../controllers/danhgia/danhgia-controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.end(JSON.stringify({
    message:'Binh luan thành công'
  }));
});

router.post("/them-danh-gia/:idKH/:idMon",ThemDanhGia);
router.put("/sua-danh-gia/:idKH/:idMon",SuaDanhGia);
router.put("/xoa-danh-gia/:idKH/:idMon",XoaDanhGia);

module.exports = router;
