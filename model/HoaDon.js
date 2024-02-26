const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

const HoaDonSchema = new db.mongodb.Schema(
    {
        idKH: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang', required: true },
        idNV: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien' },
        idKM: { type: mongoose.Schema.Types.ObjectId, ref: 'KhuyenMai' },
        idCH: { type: mongoose.Schema.Types.ObjectId, ref: 'CuaHang', required: true },
        maHD: { type: String, default: 'N/A' },
        phanTramKhuyenMaiDat: { type: Number, default: 0 },
        diaChiGiaoHang: { type: String, default: 'N/A' },
        ghiChu: { type: String, default: 'N/A' },
        thoiGianTao: { type: Date, default: Date.now() },
        tongTien: { type: Number, default: 0 },
        thoiGianGiaoHangDuKien: { type: Date, default: '' },
        trangThaiThanhToan: {
            type: Number,
            enum: [0, 1],
            default: 0, // 0 chưa thanh toán ; 1 : đã thanh toán

        },
        trangThaiMua: {
            type: Number,
            enum: [0, 1, 2, 3, 4],
            default: 0, // 0 đợi duyệt  ; 1 : đang chuẩn bị ; 2: đang giao hàng ; 3: giao hàng thất bại ; 4: giao hàng thành công

        },
        trangThai: { type: Boolean, default: true },
    }, { collection: 'HoaDon' }
);

let model = db.mongodb.model('HoaDon', HoaDonSchema);

module.exports = { model }