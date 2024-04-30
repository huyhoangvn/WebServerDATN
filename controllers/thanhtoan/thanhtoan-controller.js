const { model: CuaHang } = require("../../model/CuaHang");
const { model: HoaDon } = require("../../model/HoaDon");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require('moment');

const paymentZalo = async (req, res) => {
  const ZALOPAY_CREATE_ORDER_ENDPOINT = "https://sb-openapi.zalopay.vn/v2/create"; 
  try {
    const idHD = req.params.idHD;
    const hd = await HoaDon.findOne({ _id: idHD });
    // let ch = null;
    // if(hd){ 
    //   ch = await CuaHang.findOne({ _id: hd.idCH });
    // } else {
    //   res.json({ msg: "Lỗi tìm hóa đơn", success: false });
    // };
    let config = {
      app_id: "554",
      key1: "8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn",
      key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny",
      endpoint: ZALOPAY_CREATE_ORDER_ENDPOINT,
    };
    const embed_data = {};
    const items = [hd];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: "FoodCenter",
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: hd.thanhTien,
      description: `Thanh toán đơn hàng #${hd.maHD}`,
      bank_code: "zalopayapp",
      callback_url: `${req.protocol}://${req.get("host")}/callback`
    };
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item
      "|" +
      order.callback_url
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    const response = await axios.post(config.endpoint, null, { params: order });
    if(response.data.return_code === 1){
      return res.json({
        index: response.data,
        success: true,
        msg: response.data.sub_return_message
      });
    } else {
      return res.json({
        index: response.data,
        success: false,
        msg: "Thất bại tạo QR thanh toán"
      });
    }
  } catch (error) {
    return res.json({ msg: "Lỗi", success: false, error: error.message });
  }
}

const createQR = async (req, res) => {
  try {
    const idHD = req.params.idHD;
    const hd = await HoaDon.findOne({ _id: idHD });
    
    if (hd) {
      const ch = await CuaHang.findOne({ _id: hd.idCH });
      const des = "Thanh toán hóa đơn mã " + hd.maHD
      const qrURL = `https://img.vietqr.io/image/${ch.nganHangThuHuong}-${ch.taiKhoanThanhToan}-print.png?amount=${hd.thanhTien}&addInfo=${des}&accountName=${ch.tenTaiKhoan}`;
      return res.json({ index: qrURL, success: true, message: "Lấy QR thành công" });
    } else {
      return res.json({ msg: "HoaDon not found", success: false });
    }
  } catch (e) {
    return res.json({ msg: e.message, success: false });
  }
}

const danhSachNganHang = async (req, res) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.vietqr.io/v2/banks',
    headers: { }
  };

  try {
    const response = await axios.request(config);
    const banks = response.data.data.map(({ code, name }) => ({ value: code, key: name }));
    return res.json({ msg: "Thành công", index: banks, success: true });
  } catch (error) {
    return res.json({ msg: error.message, success: false });
  }
}


module.exports = {
  paymentZalo,
  createQR,
  danhSachNganHang
}