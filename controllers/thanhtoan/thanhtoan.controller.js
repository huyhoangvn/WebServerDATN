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
      let ch = null;
      if(hd){ 
        ch = await CuaHang.findOne({ _id: hd.idCH });
      } else {
        res.json({ msg: "Lỗi tìm hóa đơn", success: false });
      };
      let config = {}
      if(ch){
        config = {
          app_id: ch.app_id,
          key1: ch.key1,
          key2: ch.key2,
          endpoint: ZALOPAY_CREATE_ORDER_ENDPOINT,
        };
      } else {
        res.json({ msg: "Chưa có xác thực liên kết zalopay", success: false });
      }
      const embed_data = {};
      const items = [hd];
      const transID = Math.floor(Math.random() * 1000000);
      const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
        app_user: ch.tenCH,
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
  
  testCallBack: async (req, res) => {
    console.log("Hi")
    try {
        const idHD = req.params.idHD;
        const hd = await HoaDon.findOne({ _id: idHD });
        let ch = null;
        if(hd){ 
          ch = await CuaHang.findOne({ _id: hd.idCH });
        } else {
          res.json({ msg: "Lỗi tìm hóa đơn", success: false });
        };
        let config = {}
        if(ch){
          config = {
            app_id: ch.app_id,
            key1: ch.key1,
            key2: ch.key2,
            endpoint: ZALOPAY_CREATE_ORDER_ENDPOINT,
          };
        } else {
          res.json({ msg: "Chưa có xác thực liên kết zalopay", success: false });
        }
        const postData = {
            appid: config.appid,
            apptransid: orderid,
        };

        const data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key1
        postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const postConfig = {
            method: 'post',
            url: config.endpoint,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(postData)
        };

        const response = await axios(postConfig); // Gửi request kiểm tra trạng thái thanh toán

        // Xử lý phản hồi và gửi lại kết quả cho client
        if (response.data.returncode === 1) {
            res.json({ success: true, msg: "Thanh toán thành công" });
        } else {
            res.json({ success: false, msg: "Thanh toán không thành công" });
        }
    } catch (error) {
      res.json({ success: false, msg: "Lỗi kiểm tra giao dịch" });
    }
  }
}
module.exports = thanhToanController;
