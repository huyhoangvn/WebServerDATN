const db = require('../config/mongodbHelper');
const { ObjectId } = require("mongodb");

const HinhAnhMonSchema = new db.mongodb.Schema(
    {
        idMon: { type: mongoose.Schema.Types.ObjectId, ref: 'Mon', required: true },
        hinhAnh: { type: String, default: 'N/A' },
        trangThai: { type: Boolean, default: true }
    }, { collection: 'HinhAnhMon' }
);

let model = db.mongodb.model('HinhAnhMon', HinhAnhMonSchema);

module.exports = { model }