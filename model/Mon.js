const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const MonSchema = new db.mongodb.Schema(
    {
        idLM: { type: mongoose.Schema.Types.ObjectId, ref: 'LoaiMon', required: true },
        idNV: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien', required: true },
        idCH: { type: mongoose.Schema.Types.ObjectId, ref: 'CuaHang', required: true },
        tenMon: { type: String, default: "" },
        giaTien: { type: Number, default: 0 },
        hinhAnh: { type: String, default: "N/A" },
        trangThai: { type: Boolean, default: true }
    }, { collection: 'Mon' }
);

let model = db.mongodb.model('Mon', MonSchema);

module.exports = { model }