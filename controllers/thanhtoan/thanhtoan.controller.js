const { model: CuaHang } = require("../../model/CuaHang");
const { model: HoaDon } = require("../../model/HoaDon");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const { config } = require("dotenv");
const moment = require('moment');
const qs = require('qs');

const ZALOPAY_CREATE_ORDER_ENDPOINT = "https://sb-openapi.zalopay.vn/v2/create"; 
// Đổi thành 'https://openapi.zalopay.vn/v2/create' khi đi vào môi trường Production

const thanhToanController = {
  paymentZalo: async (req, res) => {
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
  },
}
module.exports = thanhToanController;
