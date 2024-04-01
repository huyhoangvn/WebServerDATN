const nodemailer = require("nodemailer");
const asyncHandle = require("express-async-handler");
require("dotenv").config();
const testService = require("../../routes/api/test/test.service");
const ApiError = require("../../untils/ApiError");
const { model: KhachHang } = require("../../model/KhachHang");
const httpStatus = require("http-status");
const { handleSendMail } = require("../../config/nodemai");
const axios = require('axios');
const crypto = require('crypto');
const { name } = require("ejs");

  const testControllers = {
    
    verification: asyncHandle(async (req, res) => {
      const { email } = req.body;
      const verificationCode = Math.round(1000 + Math.random() * 9000);
  
      try {
        const data = {
          from: `"Support EventHub Appplication" <${process.env.USERNAME_EMAIL}>`,
          to: email,
          subject: 'Verification email code',
          text: 'Your code to verification email',
          html: `<h1>${verificationCode}</h1>`,
        };
  
        await handleSendMail(data);
  
        res.status(200).json({
          success: true,
          message: 'Send verification code successfully!!!',
          data: {
            code: verificationCode,
          },
        });
      } catch (error) {
        res.json({success: false, message: 'không đúng email'})
      }
    }),

    sendSms: asyncHandle(async (req, res) => {
      const { phone } = req.body;
      const verificationCode = Math.round(1000 + Math.random() * 9000);
      try {
       
 
  
      
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to send verification code', false, error.message);
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
              name: 'Nguyen Van A',
              phone: '0987654321',
              email: 'quyetlv1611@gmail.com'
          };
  
          const items = [
              {
                  name: 'item1',
                  quantity: 1,
                  price: 50000
              },
              {
                  name: 'item2',
                  quantity: 2,
                  price: 30000
              }
          ];
  
          const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  
          const signature = crypto.createHmac('sha256', secretKey)
              .update(rawSignature)
              .digest('hex');
  
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
              lang: 'vi',
              userInfo: userInfo,
              items: items
          };
  
          const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody);
  
          res.json(response.data);
      } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, msg: 'An error occurred while processing payment request' });
      }
  }

  
  
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
