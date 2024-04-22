const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');


const CuaHangSchema = new db.mongodb.Schema(
    {
        tenCH: { type: String, required: true },
        email: { type: String, default: "" },
        sdt: { type: String, default: "0000000000" },
        tenTaiKhoan: { type: String, default: "" },
        taiKhoanThanhToan: { type: String, default: 0 },
        diaChi: { type: String, default: "" },
        thoiGianTao: { type: Date, default: Date.now() },
        thoiGianMo: { type: String, default: "00:00:00" },
        thoiGianDong: { type: String, default: "00:00:00" },
        hinhAnh: { type: String, default: "N/A" },
        trangThai: { type: Boolean, required: true },

        //Thanh toán
        app_id: { type: String, default: "" },
        key1: { type: String, default: "" },
        key2: { type: String, default: "" },
    }, { collection: 'CuaHang' }
)

let model = db.mongodb.model('CuaHang', CuaHangSchema);

module.exports = { model }