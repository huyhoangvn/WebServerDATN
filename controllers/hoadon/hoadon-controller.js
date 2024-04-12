const { model: HoaDon } = require("../../model/HoaDon");
const { model: MonDat } = require("../../model/MonDat");
const { model: KhachHang } = require("../../model/KhachHang");
const { model: CuaHang } = require("../../model/CuaHang");
const mongoose = require("mongoose");

const moment = require('moment');

const updateHoaDon = async (req, res) => {
    try {
        const id = req.params.id;
        const item = await HoaDon.findById(id);

        if (!item) {
            return ({ msg: 'Không tìm thấy hóa đơn để cập nhật', dataSave: null });
        }
        const diaChiGiaoHang = req.body.diaChiGiaoHang || item.diaChiGiaoHang;
        const ghiChu = req.body.ghiChu || item.ghiChu;
        const thoiGianTao = req.body.thoiGianTao || item.thoiGianTao;
        const thoiGianGiaoHangDuKien = req.body.thoiGianGiaoHangDuKien || item.thoiGianGiaoHangDuKien;
        const trangThai = false;
        const trangThaiMua = 0;
        const trangThaiThanhToan = 0;

        if (diaChiGiaoHang.length > 100 || ghiChu.length > 100) {
            throw new Error(" địa chỉ hoặc ghi chú vượt quá số lượng ký tự cho phép")
        }

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
            id,
            { $set: updateFields },
            { new: true }
        );
        // Kiểm tra xem đã gửi phản hồi chưa trước khi tiếp tục
        if (res.headersSent) {
            console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi kết quả.");
        } else {
            // Trả về kết quả thay vì gửi phản hồi trực tiếp
            return {
                msg: 'Cập nhật thành công', dataSave: updatedHD, success: true
            };
        };
    } catch (error) {
        // Xử lý lỗi và cung cấp một thông báo lỗi thân thiện với người dùng
        console.error(error);
        return { msg: 'Đã xảy ra lỗi khi cập nhật hóa đơn', error: 'Lỗi không xác định' };
    }
};

const getHoaDon = async (req, res, next) => {
    try {

        const trang = parseInt(req.query.trang) || 1;
        const currentPage = trang;
        const filter = {};
        if (typeof (req.query.maHD) !== 'undefined' && req.query.maHD !== "") {
            filter.maHD = { $regex: req.query.maHD, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
        }

        // Xử lý tìm kiếm theo trạng thái thanh toán
        if (typeof req.query.trangThaiThanhToan !== 'undefined' && !isNaN(parseInt(req.query.trangThaiThanhToan))) {
            const trangThaiValue = parseInt(req.query.trangThaiThanhToan);
            if ([0, 1].includes(trangThaiValue)) {
                filter.trangThaiThanhToan = trangThaiValue;
            }
        }

        // Xử lý tìm kiếm theo trạng thái mua
        if (typeof req.query.trangThaiMua !== 'undefined' && !isNaN(parseInt(req.query.trangThaiMua))) {
            const trangThaiValue = parseInt(req.query.trangThaiMua);
            if ([0, 1, 2, 3, 4].includes(trangThaiValue)) {
                filter.trangThaiMua = trangThaiValue;
            }
        }
        if (typeof req.query.trangThai !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
            const trangThaiValue = parseInt(req.query.trangThai);
            if (trangThaiValue === 1 || trangThaiValue === 0) {
                filter.trangThai = trangThaiValue === 1 ? true : false;
            }
        } else {
            // Nếu không có truy vấn trạng thái, mặc định là true
            filter.trangThai = true;
        }

        // Xử lý tìm kiếm theo thời gian tạo
        if (typeof req.query.thoiGianTao !== 'undefined' && req.query.thoiGianTao !== "") {
            const parts = req.query.thoiGianTao.split('/');
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);

            const startDate = new Date(year, month - 1, day); // Lưu ý: Tháng trong JavaScript bắt đầu từ 0
            const endDate = new Date(year, month - 1, day + 1); // Ngày kế tiếp

            filter.thoiGianTao = {
                $gte: startDate,
                $lt: endDate
            };
        }

        const totalHoaDon = await HoaDon.countDocuments(filter);

        const list = await HoaDon.aggregate([
            {
                $match: filter,
            },
            {
                $sort: { thoiGianTao: -1 } // Sắp xếp tăng dần theo thời gian tạo, để sắp xếp giảm dần, sử dụng -1
            },
            {
                $project: {
                    "maHD": "$maHD",
                    "trangThaiThanhToan": "$trangThaiThanhToan",
                    "trangThaiMua": "$trangThaiMua",
                    "tongTien": "$tongTien",
                    "thoiGianTao": "$thoiGianTao",
                    "thanhTien": "$thanhTien",
                    "trangThai": "$trangThai",
                }
            },
            {
                $skip: (trang - 1) * 10,
            },
            {
                $limit: 10,
            },
        ]);

        const totalPages = Math.ceil(totalHoaDon / 10);
        return {
            list: list,
            count: list.length,
            totalPages: totalPages,
            currentPage: currentPage,
            success: true,
            msg: 'thành công'
        };
    } catch (error) {
        console.error(error);
        return ({ error: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn' });
    }
}
const getHoaDonWeb = async (req, res, next) => {
    try {

        const trang = parseInt(req.query.trang) || 1;
        const currentPage = trang;
        const filter = {};
        if (typeof (req.query.maHD) !== 'undefined' && req.query.maHD !== "") {
            filter.maHD = { $regex: req.query.maHD, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
        }

        // Xử lý tìm kiếm theo trạng thái thanh toán
        if (typeof req.query.trangThaiThanhToan !== 'undefined' && !isNaN(parseInt(req.query.trangThaiThanhToan))) {
            const trangThaiValue = parseInt(req.query.trangThaiThanhToan);
            if ([0, 1].includes(trangThaiValue)) {
                filter.trangThaiThanhToan = trangThaiValue;
            }
        }

        // Xử lý tìm kiếm theo trạng thái mua
        if (typeof req.query.trangThaiMua !== 'undefined' && !isNaN(parseInt(req.query.trangThaiMua))) {
            const trangThaiValue = parseInt(req.query.trangThaiMua);
            if ([0, 1, 2, 3, 4].includes(trangThaiValue)) {
                filter.trangThaiMua = trangThaiValue;
            }
        }


        // Xử lý tìm kiếm theo thời gian tạo
        if (typeof req.query.thoiGianTao !== 'undefined' && req.query.thoiGianTao !== "") {
            const parts = req.query.thoiGianTao.split('-');
            const day = parseInt(parts[2]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[0]);

            const startDate = new Date(year, month - 1, day); // Lưu ý: Tháng trong JavaScript bắt đầu từ 0
            const endDate = new Date(year, month - 1, day + 1); // Ngày kế tiếp

            filter.thoiGianTao = {
                $gte: startDate,
                $lt: endDate
            };
        }

        const totalHoaDon = await HoaDon.countDocuments(filter);

        const list = await HoaDon.aggregate([
            {
                $match: filter,
            },
            {
                $sort: { thoiGianTao: -1 } // Sắp xếp tăng dần theo thời gian tạo, để sắp xếp giảm dần, sử dụng -1
            },
            {
                $project: {
                    "maHD": "$maHD",
                    "trangThaiThanhToan": "$trangThaiThanhToan",
                    "trangThaiMua": "$trangThaiMua",
                    "tongTien": "$tongTien",
                    "thoiGianTao": "$thoiGianTao",
                    "thanhTien": "$thanhTien",
                }
            },
            {
                $skip: (trang - 1) * 10,
            },
            {
                $limit: 10,
            },
        ]);

        const totalPages = Math.ceil(totalHoaDon / 10);
        return {
            list: list,
            count: list.length,
            totalPages: totalPages,
            currentPage: currentPage,
            success: true,
            msg: 'thành công'
        };
    } catch (error) {
        console.error(error);
        return ({ error: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn' });
    }
}

const getSoLuongHoaDon = async (req, res, next) => {
    try {
        const filter = {};
        if (typeof (req.query.maHD) !== 'undefined' && req.query.maHD !== "") {
            filter.maHD = { $regex: req.query.maHD, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
        }

        // Xử lý tìm kiếm theo trạng thái thanh toán
        if (typeof req.query.trangThaiThanhToan !== 'undefined' && !isNaN(parseInt(req.query.trangThaiThanhToan))) {
            const trangThaiValue = parseInt(req.query.trangThaiThanhToan);
            if ([0, 1].includes(trangThaiValue)) {
                filter.trangThaiThanhToan = trangThaiValue;
            }
        }

        // Xử lý tìm kiếm theo trạng thái mua
        if (typeof req.query.trangThaiMua !== 'undefined' && !isNaN(parseInt(req.query.trangThaiMua))) {
            const trangThaiValue = parseInt(req.query.trangThaiMua);
            if ([0, 1, 2, 3, 4].includes(trangThaiValue)) {
                filter.trangThaiMua = trangThaiValue;
            }
        }

        // Xử lý tìm kiếm theo thời gian tạo
        if (typeof req.query.thoiGianTao !== 'undefined' && req.query.thoiGianTao !== "") {
            const parts = req.query.thoiGianTao.split('-');
            const day = parseInt(parts[2]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[0]);

            const startDate = new Date(year, month - 1, day); // Lưu ý: Tháng trong JavaScript bắt đầu từ 0
            const endDate = new Date(year, month - 1, day + 1); // Ngày kế tiếp

            filter.thoiGianTao = {
                $gte: startDate,
                $lt: endDate
            };
        }

        const result = await HoaDon.aggregate([
            {
                $match: filter,
            },
            {
                $count: "count",
            }
        ]);

        return {
            count: result[0].count,
            success: true,
            msg: "Thành công"
        };
    } catch (error) {
        console.error(error);
        return ({ error: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn' });
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
            return res.json({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: updatetrangThaiThanhToan,
            success: true,
        };
    } catch (e) {
        console.log(e);
        return ({ error: "Đã xảy ra lỗi khi update " });
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
            return ({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: updatetrangThaiThanhToan,
            success: true,
        };
    } catch (e) {
        console.log(e);
        return ({ error: "Đã xảy ra lỗi khi update " });
    }
}
const updatetrangThaiMuaDangChuanBi = async (req, res, next) => {
    try {
        const id = req.params.id;
        const soPhutGiaoHang = parseInt(req.body.soPhutGiaoHang);

        const hoaDon = await HoaDon.findOne({ _id: id });

        // Kiểm tra nếu không tìm thấy hoặc hoá đơn đã được mua
        if (!hoaDon || hoaDon.trangThaiMua === 1) {
            return ({ error: "Không tìm thấy hoặc hoá đơn đã đang giao" });
        }

        // Cập nhật trạng thái mua
        hoaDon.trangThaiMua = 1;
        hoaDon.thoiGianDuyet = Date.now();

        // Nếu có số phút giao hàng từ body, thêm số phút đó vào thời gian giao hàng dự kiến
        if (soPhutGiaoHang) {
            hoaDon.thoiGianGiaoHangDuKien = new Date(hoaDon.thoiGianDuyet.getTime() + soPhutGiaoHang * 60000); // Thêm số phút giao hàng vào thời gian giao hàng dự kiến
        }

        // Lưu hoá đơn đã cập nhật
        const updatedHoaDon = await hoaDon.save();
        return {
            msg: "update thành công",
            data: updatedHoaDon,
            success: true,
        };
    } catch (e) {
        console.log(e);
        return ({
            msg: "Đã xảy ra lỗi khi update ",
            success: false
        });
    }
}
const updatetrangThaiMuaDangGiaoHang = async (req, res, next) => {
    try {
        const id = req.params.id;

        const updatetrangThaiMua = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangThaiMua: 2 } },
            { new: true },
        );
        if (!updatetrangThaiMua) {
            return ({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: updatetrangThaiMua,
            success: true,
        };
    } catch (e) {
        console.log(e);
        return ({ error: "Đã xảy ra lỗi khi update " });
    }
}
const updatetrangThaiMuaGiaoHangThatBai = async (req, res, next) => {
    try {
        const id = req.params.id;

        const updatetrangThaiMua = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangThaiMua: 4 } },
            { new: true },
        );
        if (!updatetrangThaiMua) {
            return ({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: updatetrangThaiMua,
            success: true,
        };
    } catch (e) {
        console.log(e);
        return ({ error: "Đã xảy ra lỗi khi update " });
    }
}
const updatetrangThaiMuaGiaoHangThanhCong = async (req, res, next) => {
    try {
        const id = req.params.id;

        const updatetrangThaiMua = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangThaiMua: 3 } },
            { new: true },
        );
        if (!updatetrangThaiMua) {
            return ({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: updatetrangThaiMua,
            success: true,
        };
    } catch (e) {
        console.log(e);
        return ({ error: "Đã xảy ra lỗi khi update " });
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
            return ({ error: "Không tìm thấy hoa don" });
        }

        return {
            msg: "Đã xoa hoa don thanh công",
            data: deleteHoaDon,
            success: true,
        };
    } catch (e) {
        console.log(e);
        return ({ error: "Đã xảy ra lỗi khi xóa hóa đơn" });
    }
};

const deleteHoaDonCung = async (req, res, next) => {
    try {
        const idHD = req.params.idHD;

        // Tìm và xóa hóa đơn cùng với các món đặt có idHoaDon tương ứng
        const deletedHoaDon = await HoaDon.findByIdAndDelete(idHD);
        if (!deletedHoaDon) {
            return ({ error: "Không tìm thấy hoá đơn" });
        }

        // Xóa các món đặt có idHoaDon tương ứng
        const deletedMonDat = await MonDat.deleteMany({ idHD: idHD });

        return {
            msg: "Đã xóa hoá đơn thành công",
            success: true,
        };
    } catch (e) {
        console.log(e);
        return ({ error: "Đã xảy ra lỗi khi xóa hóa đơn" });
    }
};

const chiTietHoaDon = async (req, res, next) => {
    try {
        // Lấy chi tiết hóa đơn
        const id = req.params.id;

        if (!id) {
            return ({ msg: "ID không được cung cấp", success: false });
        }

        const item = await HoaDon.findById(id);

        if (!item) {
            return ({ msg: "Không tìm thấy Hóa Đơn", success: false });
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
                    "giaTienDat": { $multiply: ["$soLuong", "$mon.giaTien"] },
                    "hinhAnh": { $concat: [`${req.protocol}://${req.get("host")}/public/images/`, "$mon.hinhAnh"] }
                }
            },
            {
                $project: {
                    idMD: "$_id",
                    idHD: 1,
                    idMon: 1,
                    giaTienDat: 1,
                    tenMon: "$mon.tenMon",
                    tenCH: "$cuahang.tenCH",
                    tenLM: "$loaiMon.tenLM",
                    hinhAnh: 1
                }
            }
        ]);
        const formatDate = (date) => {
            if (date) {
                const day = ("0" + date.getDate()).slice(-2);
                const month = ("0" + (date.getMonth() + 1)).slice(-2);
                const year = date.getFullYear();
                const hours = ("0" + date.getHours()).slice(-2);
                const minutes = ("0" + date.getMinutes()).slice(-2);
                return `${day}/${month}/${year} ${hours}:${minutes}`;
            }
            return "00:00:00 00:00";

        };

        // Sử dụng hàm formatDate để chuyển đổi các trường thời gian


        return {
            hoaDon: {
                idHD: item._id,
                idKH: item.idKH,
                idCH: item.idCH,
                phanTramKhuyenMaiDat: item.phanTramKhuyenMaiDat,
                diaChiGiaoHang: item.diaChiGiaoHang,
                phiGiaoHang: item.phiGiaoHang,
                ghiChu: item.ghiChu,
                tongTien: item.tongTien,
                thanhTien: item.thanhTien,
                thoiGianTao: formatDate(item.thoiGianTao),
                thoiGianGiaoHangDuKien: formatDate(item.thoiGianGiaoHangDuKien),
                thoiGianDuyet: formatDate(item.thoiGianDuyet),
                trangThaiThanhToan: item.trangThaiThanhToan,
                trangThaiMua: item.trangThaiMua,
                trangThai: item.trangThai,
                maHD: item.maHD,
                tenKH: khachHang ? khachHang.tenKH : "",
                tenCH: cuaHang ? cuaHang.tenCH : ""  // Lấy tên cửa hàng từ bảng CuaHang
            },
            monDat: result,
            count: result.length,
            msg: "Lấy chi tiết thành công",
            success: true
        };

    } catch (e) {
        console.log(e);
        return ({ msg: "Đã xảy ra lỗi khi lấy chi tiết hóa đơn" });
    }
};

module.exports = {
    updateHoaDon,
    getHoaDon,
    getSoLuongHoaDon,
    chiTietHoaDon,
    deleteHoaDon,
    updatetrangThaiMuaDangChuanBi,
    updatetrangThaiMuaDangGiaoHang,
    updatetrangThaiMuaGiaoHangThanhCong,
    updatetrangThaiMuaGiaoHangThatBai,
    updatetrangThaiThanhToanTrue,
    updatetrangThaiThanhToanFalse,
    getHoaDonWeb,
    deleteHoaDonCung,

}
