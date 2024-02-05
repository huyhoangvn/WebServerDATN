const db = require('../config/mongodbHelper');
const { ObjectId } = require("mongodb");

const AdminSchema = new db.mongodb.Schema(
    {
        ten: { type: String, required: true },
        taiKhoan: { type: String, unique: true, required: true },
        matKhau: { type: String, required: true },
        trangThai: { type: Boolean, default: true }
    }, { collection: 'Admin' }
);

let model = db.mongodb.model('Admin', AdminSchema);

module.exports = { model }