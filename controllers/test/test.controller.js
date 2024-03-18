const nodemailer = require("nodemailer");
const asyncHandle = require("express-async-handler");
require("dotenv").config();
const testService = require("../../routes/api/test/test.service");
const ApiError = require("../../untils/ApiError");
const { model: KhachHang } = require("../../model/KhachHang");
const httpStatus = require("http-status");
const { handleSendMail } = require("../../config/nodemai");


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
