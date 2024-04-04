var express = require('express');
var router = express.Router();

const {
  GetKhuyenMaiTheoId,
  getTatCaKhuyenMai,
} = require('../../../controllers/khuyenmai/khuyenmai-controller');

/* GET users listing. */
router.get("/get-khuyen-mai-theo-id/:idKM", GetKhuyenMaiTheoId);

router.get("/get-tat-ca-khuyen-mai", getTatCaKhuyenMai);

module.exports = router;
