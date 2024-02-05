const db = require('../config/mongodbHelper');
const { ObjectId } = require("mongodb");

const LoaiMonSchema = new db.mongodb.Schema(
    {
        idKH: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang', required: true },
        idMon: { type: mongoose.Schema.Types.ObjectId, ref: 'Mon', required: true },
        trangThai: { type: Boolean, default: true }
    }
);

let model = db.mongodb.model('LoaiMon', LoaiMonSchema);

module.exports = { model }