const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const LoaiMonSchema = new db.mongodb.Schema(
    {
        idKH: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang', required: true },
        idMon: { type: mongoose.Schema.Types.ObjectId, ref: 'Mon', required: true },
        trangThai: { type: Boolean, default: true }
    }, { collection: 'GioHang' }
);

let model = db.mongodb.model('LoaiMon', LoaiMonSchema);

module.exports = { model }