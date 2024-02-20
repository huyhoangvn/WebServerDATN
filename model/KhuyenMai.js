const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const KhuyenMaiSchema = new db.mongodb.Schema(
    {
        tieuDe: { type: String, required: true, default: "N/A" },
        noiDung: { type: String, required: true, default: "N/A" },
        ngayBatDau: { type: String, default: "N/A" },
        ngayHetHan: { type: String, default: "N/A" },
        phanTramKhuyenMai: { type: Number, default: 0 },
        donToiThieu: { type: Number, default: 0 },
        trangThai: { type: Boolean, default: true }
    }, { collection: 'KhuyenMai' }
);

const model = db.mongodb.model('KhuyenMai', KhuyenMaiSchema);

module.exports = { model }