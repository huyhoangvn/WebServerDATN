const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const NhanVienSchema = new db.mongodb.Schema(
    {
        idCH: { type: mongoose.Schema.Types.ObjectId, ref: 'CuaHang', required: true },
        taiKhoan: { type: String, unique: true, required: true },
        matKhau: { type: String, required: true },
        tenNV: { type: String, default: "" },
        gioiTinh: { type: Number, default: 2 },
        thoiGianTao: { type: Date, default: Date.now() },
        hinhAnh: { type: String, default: "N/A" },
        diaChi: { type: String, default: "" },
        sdt: { type: String, default: "0000000000" },
        trangThai: { type: Boolean, required: true },
        phanQuyen: {
            type: Number,
            enum: [0, 1, 2],
            default: 1, // 1: nhân viên ;0: Quản Lý; 2: Chờ duyệt
        },
    }, { collection: 'NhanVien' }
);

let model = db.mongodb.model('NhanVien', NhanVienSchema);

module.exports = { model }