const nodemailer = require('nodemailer');

// Tiếp tục mã của bạn...
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.USERNAME_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
});

exports.handleSendMail = async (val) => {
    try {
        await transporter.sendMail(val);
        return 'OK';
    } catch (error) {
     console.log("🚀 ~ exports.handleSendMail= ~ error:", error)
    }
};