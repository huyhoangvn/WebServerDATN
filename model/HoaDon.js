const db = require('../config/mongodbHelper');
const mongoose = require('mongoose');

function generateRandomNumber() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

const HoaDonSchema = new db.mongodb.Schema(
    {
        idKH: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang', required: true },
        idNV: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien' },
        idKM: { type: mongoose.Schema.Types.ObjectId, ref: 'KhuyenMai' },
        idCH: { type: mongoose.Schema.Types.ObjectId, ref: 'CuaHang', required: true },
        maHD: { type: String, default: generateRandomNumber },
        phanTramKhuyenMaiDat: { type: Number, default: 0 },
        phiGiaoHang: { type: Number, default: 24000 },
        thanhTien: { type: Number, default: 0 },
        diaChiGiaoHang: { type: String, default: "" },
        ghiChu: { type: String, default: "" },
        thoiGianTao: { type: Date, default: Date.now() },
        thoiGianDuyet: { type: Date, default: null },
        tongTien: { type: Number, default: 0 },
        thoiGianGiaoHangDuKien: { type: Date, default: null },

        trangThaiThanhToan: {
            type: Number,
            enum: [0, 1],
            default: 0, // 0 chưa thanh toán ; 1 : đã thanh toán

        },
        trangThaiMua: {
            type: Number,
            enum: [0, 1, 2, 3, 4],
            default: 0, // 0 đợi duyệt  ; 1 : đang chuẩn bị ; 2: đang giao hàng ; 3: giao hàng thành công ; 4: giao hàng thất bại

        },
        trangThai: { type: Boolean, default: true },

        phuongThucThanhToan: {
            type: Number,
            enum: [0, 1],
            default: 0, // 0 tiền mặt ; 1 : đã chuyển khoản

        },

        hinhAnhXacNhan: { type: String, default: "default_image.jpg" },

    }, { collection: 'HoaDon' }
);

let model = db.mongodb.model('HoaDon', HoaDonSchema);

module.exports = { model }