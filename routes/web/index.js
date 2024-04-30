var express = require('express');
var router = express.Router();
var AdminCtrl = require("../../controllers/admin/dang-nhap-web-controller");
const CryptoJS = require('crypto-js');

/* GET users listing. */
router.get('/', AdminCtrl.getViewDangNhapWeb);
router.use('/auth', require('./auth'))
router.use('/khach-hang', require('./khachhang'))
router.use('/quan-ly', require('./quanly'))
router.use('/cua-hang', require('./cuahang'))
router.use('/khuyen-mai', require('./khuyenmai'))
router.use('/loai-mon', require('./loaimon'))
router.use('/mon', require('./mon'))
router.use('/thong-ke', require('./thongke'))
router.use('/hoa-don', require('./hoadon'))
router.use('/slide', require('./slide'))
//Thanh toán
router.post('/callback', (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny").toString();
    console.log("mac =", mac);


    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.returncode = -1;
      result.returnmessage = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny");
      console.log("update order's status = success where apptransid =", dataJson["apptransid"]);

      result.returncode = 1;
      result.returnmessage = "success";
    }
  } catch (ex) {
    result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.returnmessage = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});

module.exports = router;
