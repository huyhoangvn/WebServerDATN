const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const DanhGiaSchema = new db.mongodb.Schema(
    {
        idKH: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang', required: true },
        idMon: { type: mongoose.Schema.Types.ObjectId, ref: 'Mon', required: true },
        thoiGianTao: { type: Date, default: Date.now() },
        danhGia: { type: String, default: "N/A" },
        trangThai: { type: Boolean, default: true }
    }, { collection: 'DanhGia' }
);

const model = db.mongodb.model('DanhGia', DanhGiaSchema);

module.exports = { model }