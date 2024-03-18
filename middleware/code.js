

// const preCheckCodeMiddleware = async function (req, res, next) {
//     try {
//     const code  = req.body.code
//     const verificationCode =  req.verificationCode;
//     if(code === verificationCode){
//         res.json('true')
//     }else{
//         res.json('fall')
//     }
// } catch (error) {
//     console.error('Lỗi:', error);
//     return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
//   }
// }

// module.exports = { preCheckCodeMiddleware };
