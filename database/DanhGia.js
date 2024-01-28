const db = require('./mongodbHelper');
const { ObjectId } = require("mongodb");

const DanhGiaSchema = new db.mongodb.Schema(
    {
        idKH: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang', required: true },
        idMon: { type: mongoose.Schema.Types.ObjectId, ref: 'Mon', required: true },
        danhGia: { type: String, default: "N/A" },
        trangThai: { type: Boolean, default: true }
    }
);

let model = db.mongodb.model('DanhGia', DanhGiaSchema);

module.exports = { model }