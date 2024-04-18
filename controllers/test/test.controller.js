const nodemailer = require("nodemailer");
const asyncHandle = require("express-async-handler");
require("dotenv").config();
const testService = require("../../routes/api/test/test.service");
const ApiError = require("../../untils/ApiError");
const { model: KhachHang } = require("../../model/KhachHang");
const httpStatus = require("http-status");
const { handleSendMail } = require("../../config/nodemai");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require('moment');
const qs = require('qs');
const { v4: uuid } = require('uuid');

const { name } = require("ejs");
const ZALOPAY_CREATE_ORDER_ENDPOINT = "https://sb-openapi.zalopay.vn/v2/create"; // Đổi thành 'https://openapi.zalopay.vn/v2/create' khi đi vào môi trường Production

// Thông tin Mac Key cung cấp bởi ZaloPay

const testControllers = {
  // paymentZalo : async (req, res) => {
  //   try {
  //     // Khai báo items và embeddata
  //     const items = [{ name: "Item 1", price: 50000 }];
  //     const embeddata = { user: "user123" };
  
  //     const config = {
  //       appid: "553",
  //       key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
  //       key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
  //       endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
  //     };
  //     const apptransid = `${moment().format('YYMMDD')}_${uuid()}`;
  //     const order = {
  //       appid: config.appid,
  //       apptransid: apptransid,
  //       appuser: "demo",
  //       apptime: Date.now(),
  //       item: JSON.stringify(items),
  //       embeddata: JSON.stringify(embeddata),
  //       amount: 50000,
  //       description: "ZaloPay Integration Demo",
  //       bankcode: "zalopayapp",
  //     };
  
  //     // Tính toán MAC
  //     const data = order.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
  //     order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  
  //     // Gửi dữ liệu đơn hàng đến đích ZaloPay
  //     const response = await axios.post(config.endpoint, null, { params: order });
  
  //     // Trả về phản hồi từ ZaloPay cho client
  //     res.json(response.data);
  //   } catch (error) {
  //     console.error("Error processing payment:", error);
  //     res.status(500).json({ error: "An error occurred while processing payment." });
  //   }
  // },
  paymentZalo: async (req, res) => {
    try {
      const config = {
        app_id: "2553",
        key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
        key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
        endpoint: "https://sb-openapi.zalopay.vn/v2/create",
      };
      const embed_data = {};

      const items = [{}];
      const transID = Math.floor(Math.random() * 1000000);
      const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: '0363389169',
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: 10000,
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: "zalopayapp",
        callback_url: 'http://localhost:3000/api/test/testCallback',
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
      res.json(response.data);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  
  testCallBack: async (req, res) => {
    try {
        const orderid = req.params.orderId; // Lấy orderId từ tham số trong request

        const config = {
            appid: "553",
            key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
            key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
            endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid"
        };

        const postData = {
            appid: config.appid,
            apptransid: orderid, // Sử dụng orderId nhận được từ request
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

        console.log(JSON.stringify(response.data)); // In ra phản hồi từ ZaloPay API

        // Xử lý phản hồi và gửi lại kết quả cho client
        if (response.data.returncode === 1) {
            // Thanh toán thành công
            res.json({ status: "success", message: "Payment successful." });
        } else {
            // Thanh toán không thành công
            // res.json({ status: "failed", message: "Payment not successful." });
            res.json(response.data);
        }
    } catch (error) {
        console.error("Error checking payment status:", error);
        res.status(500).json({ error: "An error occurred while checking payment status." });
    }
},
  verification: asyncHandle(async (req, res) => {
    const { email } = req.body;
    const verificationCode = Math.round(1000 + Math.random() * 9000);

    try {
      const data = {
        from: `"Support EventHub Appplication" <${process.env.USERNAME_EMAIL}>`,
        to: email,
        subject: "Verification email code",
        text: "Your code to verification email",
        html: `<h1>${verificationCode}</h1>`,
      };

      await handleSendMail(data);

      res.status(200).json({
        success: true,
        message: "Send verification code successfully!!!",
        data: {
          code: verificationCode,
        },
      });
    } catch (error) {
      res.json({ success: false, message: "không đúng email" });
    }
  }),

  sendSms: asyncHandle(async (req, res) => {
    const { phone } = req.body;
    const verificationCode = Math.round(1000 + Math.random() * 9000);
    try {
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Unable to send verification code",
        false,
        error.message
      );
    }
  }),

  paymentMomo: async (req, res) => {
    try {
      const partnerCode = "MOMO";
      const accessKey = "F8BBA842ECF85";
      const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      const requestId = partnerCode + new Date().getTime();
      const orderId = requestId;
      const orderInfo = "pay with MoMo";
      const redirectUrl = "https://momo.vn/return";
      const ipnUrl = "https://callback.url/notify";
      const amount = "50000";
      const requestType = "captureWallet";
      const extraData = "";

      const userInfo = {
        name: "Nguyen Van A",
        phone: "0987654321",
        email: "quyetlv1611@gmail.com",
      };

      const items = [
        {
          name: "item1",
          quantity: 1,
          price: 50000,
        },
        {
          name: "item2",
          quantity: 2,
          price: 30000,
        },
      ];

      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = {
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: "vi",
        userInfo: userInfo,
        items: items,
      };

      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        requestBody
      );

      res.json(response.data);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          success: false,
          msg: "An error occurred while processing payment request",
        });
    }
  },
};

// const testControllers = {
//     createOne: asyncHandle(async (req, res, next) => {
//       const verificationCode = req.verificationCode;
//       const code = req.body.code;
//       console.log(verificationCode);
//       try {
//         if (code === verificationCode) {
//           const data = await testService.createOne(req.body);
//           res.status(200).json(data);
//         } else {
//           res.status(500).json({ error: 'Invalid verification code' });
//         }
//       } catch (error) {
//         return next(new ApiError(httpStatus.NOT_FOUND, error.message));
//       }
//     }),
//   };
module.exports = testControllers;
