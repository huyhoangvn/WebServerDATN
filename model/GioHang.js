const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const GioHangSchema = new db.mongodb.Schema(
    {
        idKH: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang', required: true },
        idMon: { type: mongoose.Schema.Types.ObjectId, ref: 'Mon', required: true },
        trangThai: { type: Number, default: true }
    }, { collection: 'GioHang' }
);

let model = db.mongodb.model('GioHang', GioHangSchema);

module.exports = { model }