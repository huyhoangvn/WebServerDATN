// const nodemailer = require('nodemailer');
// const asyncHandler = require('express-async-handler');
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   auth: {
//     user: process.env.USERNAME_EMAIL,
//     pass: process.env.PASSWORD_EMAIL,
//   },
// });

// const handleSendMail = async (val) => {
//   try {
//     await transporter.sendMail(val);
//     return 'OK';
//   } catch (error) {
//     return error;
//   }
// };

// const preSaveMiddleware = async function (req, res, next) {
//   try {
//     console.log(`Yêu cầu ${req.method} đến router tại ${req.originalUrl}`);

//     // Lấy mã từ yêu cầu và từ email
//     const { email } = req.body;

//     // Sinh mã xác nhận ngẫu nhiên
//     const verificationCode = Math.round(1000 + Math.random() * 9000);

//     const data = {
//       from: `"Support EventHub Application" <${process.env.USERNAME_EMAIL}>`,
//       to: email,
//       subject: 'Verification email code',
//       text: 'Your code to verification email',
//       html: `<h1>${verificationCode}</h1>`,
//     };

//     // Promise để đợi email được gửi
//     const sendMailPromise = handleSendMail(data);

//     // Đính kèm mã xác nhận vào đối tượng req để so sánh sau này
//     req.verificationCode = verificationCode;

//     // Đợi email được gửi trước khi chuyển đến middleware hoặc route tiếp theo
//     await sendMailPromise;

//     // Chuyển đến middleware hoặc route tiếp theo
//     next();
//   } catch (error) {
//     console.error('Lỗi:', error);
//     return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
//   }
// };

// module.exports = { preSaveMiddleware };
