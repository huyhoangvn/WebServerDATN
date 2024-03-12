const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const KhuyenMaiSchema = new db.mongodb.Schema(
    {
        tieuDe: { type: String, default: "N/A" },
        maKhuyenMai: { type: String, default: "N/A" },
        ngayBatDau: { type: Date, default: "N/A" },
        ngayHetHan: { type: Date, default: "N/A" },
        phanTramKhuyenMai: { type: Number, default: 0 },
        donToiThieu: { type: Number, default: 0 },
        trangThai: { type: Boolean, default: true }
    }, { collection: 'KhuyenMai' }
);

const model = db.mongodb.model('KhuyenMai', KhuyenMaiSchema);

module.exports = { model }