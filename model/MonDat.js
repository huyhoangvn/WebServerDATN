const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const MonDatSchema = new db.mongodb.Schema(
    {
        idHD: { type: mongoose.Schema.Types.ObjectId, ref: 'HoaDon', required: true },
        idMon: { type: mongoose.Schema.Types.ObjectId, ref: 'Mon', required: true },
        giaTienDat: { type: Number, default: 0 },
        soLuong: { type: Number, default: 0, required: true }
    }, { collection: 'MonDat' }
);

let model = db.mongodb.model('MonDat', MonDatSchema);

module.exports = { model }