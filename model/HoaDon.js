const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const HoaDonSchema = new db.mongodb.Schema(
    {
        idKH: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang', required: true },
        idNV: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien', required: true },
        idKM: { type: mongoose.Schema.Types.ObjectId, ref: 'KhuyenMai' },
        diaChiGiaoHang: { type: String, default: 'N/A' },
        ghiChu: { type: String, default: 'N/A' },
        thoiGianTao: { type: String, default: Date.now },
        thoiGianGiaoHangDuKien: { type: String, default: 'N/A' },
        trangThai: { type: Boolean, default: true },
        xacNhanKhachHang: {
            type: Number,
            enum: [0, 1],
            default: 0, //0 chưa được nhận ; 1 : đã nhận được
        },
        trangThaiGiaoHang: {
            type: Number,
            enum: [0, 1, 2],
            default: 0, // 0: đang chờ giao hàng; 1:giao hàng thành công ; 2:giao hàng thất bại
        },
        trangThaiDuyet: {
            type: Number,
            enum: [0, 1, 2],
            default: 0, // 0: không được duyệt ; 1: chưa duyệt ; 2: đã duyệt 
        },
        trangThaiThanhToan: {
            type: Number,
            enum: [0, 1],
            default: 0, // 0 chưa thanh toán ; 1 : đã thanh toán

        },
    }, { collection: 'HoaDon' }
);

let model = db.mongodb.model('HoaDon', HoaDonSchema);

module.exports = { model }