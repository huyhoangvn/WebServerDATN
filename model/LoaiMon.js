const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const LoaiMonSchema = new db.mongodb.Schema(
    {
        tenLM: { type: String, default: "N/A" },
        trangThai: { type: Boolean, default: true }
    }, { collection: 'LoaiMon' }
);

let model = db.mongodb.model('LoaiMon', LoaiMonSchema);

module.exports = { model }