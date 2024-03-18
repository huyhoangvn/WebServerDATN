const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const NhanVienSchema = new db.mongodb.Schema(
    {
        idCH: { type: mongoose.Schema.Types.ObjectId, ref: 'CuaHang', required: true },
        taiKhoan: { type: String, unique: true, required: true },
        matKhau: { type: String, required: true },
        tenNV: { type: String, default: "N/A" },
        gioiTinh: { type: Number, default: 2 },
        hinhAnh: { type: String, default: "N/A" },
        diaChi: { type: String, default: "N/A" },
        sdt: { type: String, default: "0000000000" },
        trangThai: { type: Boolean, required: true },
        phanQuyen: {
            type: Number,
            enum: [0, 1],
            default: 1, // 1: nhân viên ;0: Quản Lý
        },
    }, { collection: 'NhanVien' }
);

let model = db.mongodb.model('NhanVien', NhanVienSchema);

module.exports = { model }