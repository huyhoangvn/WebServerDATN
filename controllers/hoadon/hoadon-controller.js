const { model: HoaDon } = require("../../model/HoaDon");
const { model: MonDat } = require("../../model/MonDat");
const { model: KhachHang } = require("../../model/KhachHang");
const { model: CuaHang } = require("../../model/CuaHang");
const mongoose = require("mongoose");

const moment = require('moment');

const updateHoaDon = async (req, res) => {
    try {
        const HoaDonId = req.params.id;
        const item = await HoaDon.findById(HoaDonId);

        if (!item) {
            return res.json({ msg: 'Không tìm thấy hóa đơn để cập nhật', dataSave: null });
        }
        const diaChiGiaoHang = req.body.diaChiGiaoHang || item.diaChiGiaoHang;
        const ghiChu = req.body.ghiChu || item.ghiChu;
        const thoiGianTao = req.body.thoiGianTao || item.thoiGianTao;
        const thoiGianGiaoHangDuKien = req.body.thoiGianGiaoHangDuKien || item.thoiGianGiaoHangDuKien;
        const trangThai = false;
        const trangThaiMua = 0;
        const trangThaiThanhToan = 0;

        const updateFields = {
            diaChiGiaoHang: diaChiGiaoHang,
            ghiChu: ghiChu,
            thoiGianTao: thoiGianTao,
            thoiGianGiaoHangDuKien: thoiGianGiaoHangDuKien,
            trangThai: trangThai,
            trangThaiMua: trangThaiMua,
            trangThaiThanhToan: trangThaiThanhToan,
        }
        const updatedHD = await HoaDon.findByIdAndUpdate(
            HoaDonId,
            { $set: updateFields },
            { new: true }
        );
        // Kiểm tra xem đã gửi phản hồi chưa trước khi tiếp tục
        if (res.headersSent) {
            console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi kết quả.");
        } else {
            // Trả về kết quả thay vì gửi phản hồi trực tiếp
            return { msg: 'Cập nhật thành công', dataSave: updatedHD };
        };
    } catch (error) {
        // Xử lý lỗi và cung cấp một thông báo lỗi thân thiện với người dùng
        console.error(error);
        return { msg: 'Đã xảy ra lỗi khi cập nhật hóa đơn', error: 'Lỗi không xác định' };
    }
};

const getHoaDon = async (req, res, next) => {
    try {
        const {
            trangThaiThanhToan,
            trangThaiMua,
            thoiGianTao,
            maHD,
        } = req.query;
        let filter = {};

        if (trangThaiThanhToan !== undefined) {
            filter.trangThaiThanhToan = trangThaiThanhToan;
        }
        if (trangThaiMua !== undefined) {
            filter.trangThaiMua = trangThaiMua;
        }
        if (maHD !== undefined) {
            filter.maHD = maHD;
        }
        if (thoiGianTao !== undefined) {
            filter.thoiGianTao = thoiGianTao;
        }

        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        const skip = (page - 1) * pageSize;

        const danhSachHoaDon = Object.keys(filter).length === 0
            ? await HoaDon.find().skip(skip).limit(pageSize)
            : await HoaDon.find({ $and: [filter] }).skip(skip).limit(pageSize);

        return {
            data: danhSachHoaDon,
            count: danhSachHoaDon.length,
            success: true,
            msg: 'thành công'
        };
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn' });
    }
}

const updatetrangThaiThanhToanTrue = async (req, res, next) => {
    try {
        const id = req.params.id;

        const updatetrangThaiThanhToan = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangThaiThanhToan: 1 } },
            { new: true },
        );
        if (!updatetrangThaiThanhToan) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: updatetrangThaiThanhToan,
            success: true,
        };
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi update " });
    }
}
const updatetrangThaiThanhToanFalse = async (req, res, next) => {
    try {
        const id = req.params.id;

        const updatetrangThaiThanhToan = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangThaiThanhToan: 0 } },
            { new: true },
        );
        if (!updatetrangThaiThanhToan) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: updatetrangThaiThanhToan,
            success: true,
        };
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi update " });
    }
}
const updatetrangThaiMuaDangChuanBi = async (req, res, next) => {
    try {
        const id = req.params.id;

        const updatetrangThaiMua = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangtrangThaiMua: 1 } },
            { new: true },
        );
        if (!updatetrangThaiMua) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: updatetrangThaiMua,
            success: true,
        };
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi update " });
    }
}
const updatetrangThaiMuaDangGiaoHang = async (req, res, next) => {
    try {
        const id = req.params.id;

        const updatetrangThaiMua = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangtrangThaiMua: 2 } },
            { new: true },
        );
        if (!updatetrangThaiMua) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: updatetrangThaiMua,
            success: true,
        };
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi update " });
    }
}
const updatetrangThaiMuaGiaoHangThatBai = async (req, res, next) => {
    try {
        const id = req.params.id;

        const updatetrangThaiMua = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangtrangThaiMua: 4 } },
            { new: true },
        );
        if (!updatetrangThaiMua) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: updatetrangThaiMua,
            success: true,
        };
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi update " });
    }
}
const updatetrangThaiMuaGiaoHangThanhCong = async (req, res, next) => {
    try {
        const id = req.params.id;

        const updatetrangThaiMua = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangtrangThaiMua: 3 } },
            { new: true },
        );
        if (!updatetrangThaiMua) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: updatetrangThaiMua,
            success: true,
        };
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi update " });
    }
}

const deleteHoaDon = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteHoaDon = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangThai: false } },
            { new: true } // Trả về bản ghi đã được cập nhật
        );

        if (!deleteHoaDon) {
            return res.status(404).json({ error: "Không tìm thấy hoa don" });
        }

        return {
            msg: "Đã xoa hoa don thanh công",
            data: deleteHoaDon,
            success: true,
        };
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi xóa hóa đơn" });
    }
};

const chiTietHoaDon = async (req, res, next) => {
    try {
        const id = req.params.id;

        // Lấy chi tiết hóa đơn
        const item = await HoaDon.findById(id);

        if (!item) {
            return res.status(404).json({ error: "Không tìm thấy Hóa Đơn" });
        }

        // Lookup để lấy tên khách hàng từ bảng KhachHang
        const khachHang = await KhachHang.findById(item.idKH);

        // Lookup để lấy tên cửa hàng từ bảng CuaHang
        const cuaHang = await CuaHang.findById(item.idCH);

        // Thực hiện aggregation để lấy thông tin món đặt trong hóa đơn
        const result = await MonDat.aggregate([
            { $match: { idHD: new mongoose.Types.ObjectId(id) } }, // Chỉ lấy các món đặt có idHD trong danh sách idHDs
            {
                $lookup: {
                    from: "Mon",
                    localField: "idMon",
                    foreignField: "_id",
                    as: "mon"
                }
            },
            { $unwind: "$mon" },
            {
                $lookup: {
                    from: "LoaiMon",
                    localField: "mon.idLM",
                    foreignField: "_id",
                    as: "loaiMon"
                }
            },
            { $unwind: "$loaiMon" },
            {
                $lookup: {
                    from: "CuaHang",
                    localField: "mon.idCH",
                    foreignField: "_id",
                    as: "cuahang"
                }
            },
            { $unwind: "$cuahang" },
            {
                $addFields: {
                    "giaTienDat": { $multiply: ["$soLuong", "$mon.giaTien"] }
                }
            },
            {
                $project: {
                    _id: 1,
                    idHD: 1,
                    idMon: 1,
                    giaTienDat: 1,
                    mon: "$mon.tenMon",
                    tenCH: "$cuahang.tenCH",
                    tenLM: "$loaiMon.tenLM"
                }
            }
        ]);

        return res.status(200).json({
            data: {
                hoaDon: {
                    _id: item._id,
                    idKH: item.idKH,
                    idCH: item.idCH,
                    phanTramKhuyenMaiDat: item.phanTramKhuyenMaiDat,
                    diaChiGiaoHang: item.diaChiGiaoHang,
                    ghiChu: item.ghiChu,
                    thoiGianTao: item.thoiGianTao,
                    tongTien: item.tongTien,
                    thoiGianGiaoHangDuKien: item.thoiGianGiaoHangDuKien,
                    trangThaiThanhToan: item.trangThaiThanhToan,
                    trangThaiMua: item.trangThaiMua,
                    trangThai: item.trangThai,
                    maHD: item.maHD,
                    tenKH: khachHang ? khachHang.tenKH : "", // Lấy tên khách hàng từ bảng KhachHang
                    tenCH: cuaHang ? cuaHang.tenCH : "" // Lấy tên cửa hàng từ bảng CuaHang
                },
                monDat: result
            }, // Trả về cả hóa đơn và danh sách món đặt
            msg: "Lấy chi tiết thành công",
            success: true
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi lấy chi tiết hóa đơn" });
    }
};

module.exports = {
    updateHoaDon,
    getHoaDon,
    chiTietHoaDon,
    deleteHoaDon,
    updatetrangThaiMuaDangChuanBi,
    updatetrangThaiMuaDangGiaoHang,
    updatetrangThaiMuaGiaoHangThanhCong,
    updatetrangThaiMuaGiaoHangThatBai,
    updatetrangThaiThanhToanTrue,
    updatetrangThaiThanhToanFalse,

}
