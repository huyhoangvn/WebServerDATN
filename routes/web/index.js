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

//Thanh toán
router.post('/zalopay/callback', (req, res) => {
  const { data, mac } = req.body;

  // Validate callback authenticity
  const expectedMac = crypto.createHmac('sha256', appKey).update(data).digest('hex');
  if (mac === expectedMac) {
      // Handle payment status based on 'status' field in data
      console.log('ZaloPay callback received:', data);
      // Update your order status accordingly
  } else {
      console.error('Invalid ZaloPay callback. MAC mismatch.');
  }

  res.sendStatus(200);
});

module.exports = router;
