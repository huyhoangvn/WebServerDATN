const db = require('./mongodbHelper');
const { ObjectId } = require("mongodb");

const MonSchema = new db.mongodb.Schema(
    {
        idLM: { type: mongoose.Schema.Types.ObjectId, ref: 'LoaiMon', required: true },
        idNV: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien', required: true },
        tenMon: { type: String, default: "N/A" },
        giaTien: { type: String, default: "N/A" },
        trangThai: { type: Boolean, default: true }
    }
);

let model = db.mongodb.model('Mon', MonSchema);

module.exports = { model }