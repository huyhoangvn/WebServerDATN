var express = require('express');
var router = express.Router();

const {
  GetKhuyenMaiTheoId,
  getTatCaKhuyenMaiAppApi,
} = require('../../../controllers/khuyenmai/khuyenmai-controller');

/* GET users listing. */
router.get("/get-khuyen-mai-theo-id/:idKM", GetKhuyenMaiTheoId);

router.get("/danh-sach-km", getTatCaKhuyenMaiAppApi);
module.exports = router;
