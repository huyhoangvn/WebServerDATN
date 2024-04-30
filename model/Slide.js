const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const SlideSchema = new db.mongodb.Schema(
    {
        idCH: { type: mongoose.Schema.Types.ObjectId, ref: 'CuaHang', required: true },
        idMon: { type: mongoose.Schema.Types.ObjectId, ref: 'Mon', required: true },
        imgSlide: { type: String, default: "" },
    }, { collection: 'Slide' }
);

let model = db.mongodb.model('Slide', SlideSchema);

module.exports = { model }