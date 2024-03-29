const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const KhuyenMaiCuaToiSchema = new db.mongodb.Schema(
    {
        idKM: { type: mongoose.Schema.Types.ObjectId, ref: 'KhuyenMai', required: true },
        idKH: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang', required: true },
        trangThai: { type: Boolean, default: true },
    }, { collection: 'KhuyenMaiCuaToi' }
);

const model = db.mongodb.model('KhuyenMaiCuaToi', KhuyenMaiCuaToiSchema);
module.exports = { model }