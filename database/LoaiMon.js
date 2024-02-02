const db = require('./mongodbHelper');
const { ObjectId } = require("mongodb");

const LoaiMonSchema = new db.mongodb.Schema(
    {
        tenLM: { type: String, default: "N/A" },
        trangThai: { type: Boolean, default: true }
    }
);

let model = db.mongodb.model('LoaiMon', LoaiMonSchema);

module.exports = { model }