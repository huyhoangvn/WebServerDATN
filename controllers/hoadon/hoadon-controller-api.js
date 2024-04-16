const { model: HoaDon } = require("../../model/HoaDon");
const { model: CuaHang } = require("../../model/CuaHang");
const { model: KhachHang } = require("../../model/KhachHang");
const HoaDonController = require("../../controllers/hoadon/hoadon-controller");
const mongo = require("mongoose");


// const addHoaDonApi = async (req, res, next) => {

//     try {
//         const { idKH, idCH, diaChiGiaoHang } = req.body;
//         if (!idKH || !idCH || !diaChiGiaoHang) {
//             return res.json({ msg: 'Vui lòng điền đầy đủ thông tin' });
//         }

//         const khachHang = await KhachHang.findById(idKH);
//         if (!khachHang || !khachHang.trangThai) {
//             return res.json({ msg: "Khách hàng không tồn tại hoặc không có trạng thái đúng" });
//         }
//         // Kiểm tra xem cửa hàng có tồn tại không
//         const cuaHang = await CuaHang.findById(idCH);
//         if (!cuaHang || !cuaHang.trangThai) {
//             return res.json({ msg: "Khách hàng không tồn tại hoặc không có trạng thái đúng" });
//         }

//         const saveHD = await HoaDon.create({
//             idKH,
//             idCH,
//             diaChiGiaoHang,
//             trangThaiMua: 0,
//             trangThai: true,
//             trangThaiThanhToan: 0,
//         });
//         res.json({
//             index: saveHD,
//             message: "Thêm mới hóa đơn thành công",
//             success: true,
//         });
//     } catch (error) {
//         console.error(error);
//         res.json({ message: "Lỗi khi thêm mới hóa đơn", error });
//     }
// };
const updateHoaDonApi = async (req, res, next) => {
    try {
        const result = await HoaDonController.updateHoaDon(req, res, next);
        if (!res.headersSent) {
            // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi
            res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
        } else {
            console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi kết quả.");
        };
    } catch (error) {
        // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi lỗi
        if (!res.headersSent) {
            res.json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
        } else {
            console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        }
    }
}
const getHoaDonApi = async (req, res, next) => {
    try {
        const result = await HoaDonController.getHoaDon(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}


const chiTietHoaDonApi = async (req, res, next) => {
    try {
        const data = await HoaDonController.chiTietHoaDon(req, res, next);
        res.json(data);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}

const updatetrangThaiThanhToanApi = async (req, res, next) => {
    try {
        const result = await HoaDonController.updatetrangThaiThanhToan(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}


const updatetrangThaiMuaDangChuanBiApi = async (req, res, next) => {
    try {
        const result = await HoaDonController.updatetrangThaiMuaDangChuanBi(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}
const updatetrangThaiMuaDangGiaoHangApi = async (req, res, next) => {
    try {
        const result = await HoaDonController.updatetrangThaiMuaDangGiaoHang(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}
const updatetrangThaiMuaGiaoHangThatBaiApi = async (req, res, next) => {
    try {
        const result = await HoaDonController.updatetrangThaiMuaGiaoHangThatBai(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}
const updatetrangThaiMuaGiaoHangThanhCongApi = async (req, res, next) => {
    try {
        const result = await HoaDonController.updatetrangThaiMuaGiaoHangThanhCong(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}


const deleteHoaDonApi = async (req, res, next) => {
    try {
        const result = await HoaDonController.deleteHoaDonCung(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi xóa Hóa Đơn', error: error.message });
        }
    }
}
const getDanhSachHoaDonByIdKhachHangApi = async (req, res, next) => {
    try {
        const idKH = new mongo.Types.ObjectId(req.params.idKH);
        const trang = parseInt(req.query.trang) || 1;

        if (!idKH) {
            return res.json({ msg: 'Vui lòng cung cấp ID khách hàng' });
        }

        const filter = { idKH: idKH };

        if (typeof req.query.maHD !== 'undefined' && req.query.maHD !== "") {
            filter.maHD = { $regex: req.query.maHD, $options: 'i' };
        }

        if (typeof req.query.trangThaiThanhToan !== 'undefined' && !isNaN(parseInt(req.query.trangThaiThanhToan))) {
            const trangThaiValue = parseInt(req.query.trangThaiThanhToan);
            if ([0, 1].includes(trangThaiValue)) {
                filter.trangThaiThanhToan = trangThaiValue;
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

        if (typeof req.query.trangThaiMua !== 'undefined' && !isNaN(parseInt(req.query.trangThaiMua))) {
            const trangThaiValue = parseInt(req.query.trangThaiMua);
            if ([0, 1, 2, 3, 4].includes(trangThaiValue)) {
                filter.trangThaiMua = trangThaiValue;
            }
        }

        if (typeof req.query.thoiGianTao !== 'undefined' && req.query.thoiGianTao !== "") {
            const parts = req.query.thoiGianTao.split('/');
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);

            const startDate = new Date(year, month - 1, day);
            const endDate = new Date(year, month - 1, day + 1);

            filter.thoiGianTao = { $gte: startDate, $lt: endDate };
        }

        const totalHoaDon = await HoaDon.countDocuments(filter);

        const list = await HoaDon.aggregate([
            { $match: filter },
            { $sort: { thoiGianTao: -1 } },
            { $skip: (trang - 1) * 10 },
            { $limit: 10 },
            {
                $project: {
                    "idKH": "$idKH",
                    "idCH": "$idCH",
                    "maHD": "$maHD",
                    "thoiGianTao": "$thoiGianTao",
                    "diaChiGiaoHang": "$diaChiGiaoHang",
                    "phanTramKhuyenMaiDat": "$phanTramKhuyenMaiDat",
                    "phiGiaoHang": "$phiGiaoHang",
                    "trangThaiThanhToan": "$trangThaiThanhToan",
                    "trangThaiMua": "$trangThaiMua",
                    "tongTien": "$tongTien",
                    "thanhTien": "$thanhTien",
                    "trangThai": "$trangThai",
                }
            }
        ]);

        const totalPages = Math.ceil(totalHoaDon / 10);

        res.json({
            list: list,
            count: list.length,
            totalPages,
            trang,
            msg: "Thành công",
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.json({ msg: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn của khách hàng', error: error.message });
    }
};
const getDanhSachHoaDonByIdCuaHangApi = async (req, res, next) => {
    try {
        const idCH = new mongo.Types.ObjectId(req.params.idCH);
        const trang = parseInt(req.query.trang) || 1;

        if (!idCH) {
            return res.json({ msg: 'Vui lòng cung cấp ID cửa hàng' });
        }

        const filter = { idCH: idCH };

        if (typeof req.query.maHD !== 'undefined' && req.query.maHD !== "") {
            filter.maHD = { $regex: req.query.maHD, $options: 'i' };
        }

        if (typeof req.query.trangThaiThanhToan !== 'undefined' && !isNaN(parseInt(req.query.trangThaiThanhToan))) {
            const trangThaiValue = parseInt(req.query.trangThaiThanhToan);
            if ([0, 1].includes(trangThaiValue)) {
                filter.trangThaiThanhToan = trangThaiValue;
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

        if (typeof req.query.trangThaiMua !== 'undefined' && !isNaN(parseInt(req.query.trangThaiMua))) {
            const trangThaiValue = parseInt(req.query.trangThaiMua);
            if ([0, 1, 2, 3, 4].includes(trangThaiValue)) {
                filter.trangThaiMua = trangThaiValue;
            }
        }

        if (typeof req.query.thoiGianTao !== 'undefined' && req.query.thoiGianTao !== "") {
            const parts = req.query.thoiGianTao.split('/');
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);

            const startDate = new Date(year, month - 1, day);
            const endDate = new Date(year, month - 1, day + 1);

            filter.thoiGianTao = { $gte: startDate, $lt: endDate };
        }

        const totalHoaDon = await HoaDon.countDocuments(filter);

        const list = await HoaDon.aggregate([
            { $match: filter },
            { $sort: { thoiGianTao: -1 } },
            { $skip: (trang - 1) * 10 },
            { $limit: 10 },
            {
                $project: {
                    "idKH": "$idKH",
                    "idCH": "$idCH",
                    "maHD": "$maHD",
                    "thoiGianTao": "$thoiGianTao",
                    "diaChiGiaoHang": "$diaChiGiaoHang",
                    "phanTramKhuyenMaiDat": "$phanTramKhuyenMaiDat",
                    "phiGiaoHang": "$phiGiaoHang",
                    "trangThaiThanhToan": "$trangThaiThanhToan",
                    "trangThaiMua": "$trangThaiMua",
                    "tongTien": "$tongTien",
                    "thanhTien": "$thanhTien",
                    "trangThai": "$trangThai",
                }
            }
        ]);

        const totalPages = Math.ceil(totalHoaDon / 10);

        res.json({
            list: list,
            totalPages,
            trang,
            msg: "Thành công",
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.json({ msg: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn của cửa hàng', success: false, error: error.message });
    }
};
const deleteHoaDonCungApi = async (req, res, next) => {
    try {
        const result = await HoaDonController.deleteHoaDonCung(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi xóa Hóa Đơn', error: error.message });
        }
    }
}

// Export các hàm API
module.exports = {
    deleteHoaDonApi,
    getHoaDonApi,
    getDanhSachHoaDonByIdKhachHangApi,
    getDanhSachHoaDonByIdCuaHangApi,
    chiTietHoaDonApi,
    updateHoaDonApi,
    updatetrangThaiThanhToanApi,
    updatetrangThaiMuaDangChuanBiApi,
    updatetrangThaiMuaDangGiaoHangApi,
    updatetrangThaiMuaGiaoHangThatBaiApi,
    updatetrangThaiMuaGiaoHangThanhCongApi,
    deleteHoaDonCungApi,
};
