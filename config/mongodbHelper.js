var mongodb = require('mongoose');
// const MONGODB_URL = 'mongodb://0.0.0.0:27017';
// const MONGODB_URL = 'mongodb+srv://dinhvanvu10a1:ngocvu123@datn.9th1ctg.mongodb.net/DATN_2';
const MONGODB_URL = 'mongodb+srv://phucnxph29170:Kondien123@cluster0.kutdlfc.mongodb.net';
const DB_NAME = 'BanDoAn'
mongodb.connect(MONGODB_URL + "/" + DB_NAME)
    .catch((err) => {
        console.log("Lỗi kết nối cơ sở dữ liệu");
        console.log(err);
    });

module.exports = { mongodb };