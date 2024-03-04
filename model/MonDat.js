const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const MonDatSchema = new db.mongodb.Schema(
    {
        idHD: { type: mongoose.Schema.Types.ObjectId, ref: 'HoaDon', required: true },
        idMon: { type: mongoose.Schema.Types.ObjectId, ref: 'Mon', required: true },
        giaTienDat: { type: Number, required: true },
        soLuong: { type: Number, required: true }
    }, { collection: 'MonDat' }
);

let model = db.mongodb.model('MonDat', MonDatSchema);

module.exports = { model }