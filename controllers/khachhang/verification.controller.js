const asyncHandle = require("express-async-handler");
require("dotenv").config();
const { handleSendMail } = require("../../config/nodemai");

const VerificationControllers = {

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

      res.json({
        success: true,
        message: 'Send verification code successfully!!!',
        data: {
          code: verificationCode,
        },
      });
    } catch (error) {
      res.json({ success: false, message: 'không đúng email' })
    }
  })
}



module.exports = VerificationControllers;
