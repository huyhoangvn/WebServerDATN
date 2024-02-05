const db = require('../config/mongodbHelper');
const { ObjectId } = require("mongodb");

const KhachHangSchema = new db.mongodb.Schema(
    {
        taiKhoan: { type: String, unique: true, required: true },
        matKhau: { type: String, required: true },
        tenKH: { type: String, default: "N/A" },
        gioiTinh: { type: Number, default: 2 },
        hinhAnh: { type: String, default: "N/A" },
        diaChi: { type: String, default: "N/A" },
        sdt: { type: String, default: "0000000000" },
        trangThai: { type: Boolean, required: true }
    }
);

let model = db.mongodb.model('KhachHang', KhachHangSchema);

module.exports = { model }