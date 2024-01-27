var mongodb = require('mongoose');
const MONGODB_URL = 'mongodb://0.0.0.0:27017';
const DB_NAME = 'BanDoAn'
mongodb.connect(MONGODB_URL + "/" + DB_NAME)
    .catch((err)=>{
        console.log("Lỗi kết nối cơ sở dữ liệu");
        console.log(err);
    });

module.exports = {mongodb};