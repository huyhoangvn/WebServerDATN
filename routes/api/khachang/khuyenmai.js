var express = require('express');
var router = express.Router();
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')

const {
  GetKhuyenMaiTheoId,
  getTatCaKhuyenMaiAppApi,
} = require('../../../controllers/khuyenmai/khuyenmai-controller');

/* GET users listing. */
router.get("/get-khuyen-mai-theo-id/:idKM", GetKhuyenMaiTheoId);

router.get("/danh-sach/:idKH", getTatCaKhuyenMaiAppApi);
module.exports = router;
