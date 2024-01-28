const db = require('./mongodbHelper');
const { ObjectId } = require("mongodb");


const CuaHangSchema = new db.mongodb.Schema(
    {
        tenCH: { type: String, required: true },
        email: { type: String, default: "N/A" },
        sdt: { type: String, default: "0000000000" },
        diaChi: { type: String, default: "N/A" },
        thoiGianMo: { type: String, default: "N/A" },
        thoiGianDong: { type: String, default: "N/A" },
        hinhAnh: { type: String, default: "N/A" },
        trangThai: { type: Boolean, required: true }
    }
)

let model = db.mongodb.model('CuaHang', CuaHangSchema);

module.exports = { model }