const { model: HoaDon } = require("../../model/HoaDon");
const { model: CuaHang } = require("../../model/CuaHang");
const { model: KhachHang } = require("../../model/KhachHang");
const HoaDonController = require("../../controllers/hoadon/hoadon-controller");
const mongo = require("mongoose");
const { response } = require("express");


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
        const result = await HoaDonController.deleteHoaDon(req, res, next);
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
            return res.json({ msg: 'Vui lòng cung cấp ID khách hàng', success: false });
        }
        if (
            (typeof req.query.ngayBatDau === 'undefined' && typeof req.query.ngayKetThuc !== 'undefined') ||
            (typeof req.query.ngayBatDau !== 'undefined' && typeof req.query.ngayKetThuc === 'undefined')
        ) {
            return res.json({
                msg: 'Vui lòng nhập cả ngày bắt đầu và ngày kết thúc',
                success: false
            });
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

        // Xử lý tìm kiếm theo thời gian tạo
        if (typeof req.query.ngayBatDau !== 'undefined' && req.query.ngayBatDau !== "" && typeof req.query.ngayKetThuc !== 'undefined' && req.query.ngayKetThuc !== "") {
            const ngayBatDauParts = req.query.ngayBatDau.split('/');
            const ngayKetThucParts = req.query.ngayKetThuc.split('/');

            // Tạo đối tượng Date từ các thành phần của ngày bắt đầu
            const ngayBatDau = new Date(
                parseInt(ngayBatDauParts[2]), // Năm
                parseInt(ngayBatDauParts[1]) - 1, // Tháng (lưu ý: tháng trong JavaScript bắt đầu từ 0)
                parseInt(ngayBatDauParts[0]) // Ngày
            );

            // Tạo đối tượng Date từ các thành phần của ngày kết thúc
            const ngayKetThuc = new Date(
                parseInt(ngayKetThucParts[2]), // Năm
                parseInt(ngayKetThucParts[1]) - 1, // Tháng (lưu ý: tháng trong JavaScript bắt đầu từ 0)
                parseInt(ngayKetThucParts[0]) // Ngày
            );

            // Thêm 1 ngày vào ngày kết thúc để bao gồm cả ngày đó trong khoảng thời gian tìm kiếm
            ngayKetThuc.setDate(ngayKetThuc.getDate() + 1);

            filter.thoiGianTao = {
                $gte: ngayBatDau,
                $lt: ngayKetThuc
            };
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
        res.json({ msg: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn của khách hàng', error: error.message, success: false });
    }
};
const getDanhSachHoaDonByIdCuaHangApi = async (req, res, next) => {
    try {
        const idCH = new mongo.Types.ObjectId(req.params.idCH);
        const trang = parseInt(req.query.trang) || 1;

        if (!idCH) {
            return res.json({ msg: 'Vui lòng cung cấp ID cửa hàng', success: false });
        }
        if (
            (typeof req.query.ngayBatDau === 'undefined' && typeof req.query.ngayKetThuc !== 'undefined') ||
            (typeof req.query.ngayBatDau !== 'undefined' && typeof req.query.ngayKetThuc === 'undefined')
        ) {
            return res.json({
                msg: 'Vui lòng nhập cả ngày bắt đầu và ngày kết thúc',
                success: false
            });
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

        // Xử lý tìm kiếm theo thời gian tạo
        if (typeof req.query.ngayBatDau !== 'undefined' && req.query.ngayBatDau !== "" && typeof req.query.ngayKetThuc !== 'undefined' && req.query.ngayKetThuc !== "") {
            const ngayBatDauParts = req.query.ngayBatDau.split('/');
            const ngayKetThucParts = req.query.ngayKetThuc.split('/');

            // Tạo đối tượng Date từ các thành phần của ngày bắt đầu
            const ngayBatDau = new Date(
                parseInt(ngayBatDauParts[2]), // Năm
                parseInt(ngayBatDauParts[1]) - 1, // Tháng (lưu ý: tháng trong JavaScript bắt đầu từ 0)
                parseInt(ngayBatDauParts[0]) // Ngày
            );

            // Tạo đối tượng Date từ các thành phần của ngày kết thúc
            const ngayKetThuc = new Date(
                parseInt(ngayKetThucParts[2]), // Năm
                parseInt(ngayKetThucParts[1]) - 1, // Tháng (lưu ý: tháng trong JavaScript bắt đầu từ 0)
                parseInt(ngayKetThucParts[0]) // Ngày
            );

            // Thêm 1 ngày vào ngày kết thúc để bao gồm cả ngày đó trong khoảng thời gian tìm kiếm
            ngayKetThuc.setDate(ngayKetThuc.getDate() + 1);

            filter.thoiGianTao = {
                $gte: ngayBatDau,
                $lt: ngayKetThuc
            };
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
const xacNhanThanhToanChuyenKhoanApi = async (req, res, next) => {
    try {
        const idHD = req.params.idHD;

        let updateFields = {};

        // Kiểm tra từng trường và thêm vào object updateFields nếu tồn tại giá trị
        if (req.body.phuongThucThanhToan !== undefined) {
            updateFields.phuongThucThanhToan = req.body.phuongThucThanhToan;
        }
        if (req.files.hinhAnhXacNhan && req.files.hinhAnhXacNhan.length > 0) {
            updateFields.hinhAnhXacNhan = req.files.hinhAnhXacNhan.map((file) => file.filename)[0];
        }
        if (req.body.ghiChu !== undefined) {
            updateFields.ghiChu = req.body.ghiChu;
        }

        // Nếu không có trường nào cần cập nhật, trả về lỗi
        if (Object.keys(updateFields).length === 0) {
            return res.json({ msg: "Không có trường nào cần cập nhật", success: false });
        }

        // Thực hiện cập nhật chỉ với các trường cần thiết
        const updatedHoaDon = await HoaDon.findOneAndUpdate(
            { _id: idHD },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedHoaDon) {
            return res.json({ msg: "Không tìm thấy hóa đơn", success: false });
        }

        return res.json({
            msg: "Xác nhận thanh toán thành công",
            data: updatedHoaDon,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.json({ msg: "Đã xảy ra lỗi khi xác nhận thanh toán", success: false });
    }
};

const xacNhanThanhToanTienMatApi = async (req, res, next) => {
    try {
        const idHD = req.params.idHD;
        const ghiChu = req.body.ghiChu;
        const phuongThucThanhToan = req.body.phuongThucThanhToan;
        const hinhAnhXacNhan = 'default_image.jpg'

        // Thực hiện cập nhật chỉ với các trường cần thiết
        const updatedHoaDon = await HoaDon.findOneAndUpdate(
            { _id: idHD },
            { $set: { ghiChu: ghiChu, phuongThucThanhToan: phuongThucThanhToan, hinhAnhXacNhan: hinhAnhXacNhan } },
            { new: true }
        );

        if (!updatedHoaDon) {
            return res.json({ msg: "Không tìm thấy hóa đơn", success: false });
        }

        return res.json({
            msg: "Xác nhận thanh toán thành công",
            data: updatedHoaDon,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.json({ msg: "Đã xảy ra lỗi khi xác nhận thanh toán", success: false });
    }
};
const xacNhanThanhToanThanhCongApi = async (req, res, next) => {
    try {
        const id = req.params.id;
        const ghiChu = req.body.ghiChu;
        const phuongThucThanhToan = req.body.phuongThucThanhToan;

        // Thực hiện cập nhật chỉ với các trường cần thiết
        const updatedHoaDon = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { ghiChu: ghiChu, phuongThucThanhToan: phuongThucThanhToan, trangThaiThanhToan: 1 } },
            { new: true }
        );

        if (!updatedHoaDon) {
            return res.json({ msg: "Không tìm thấy hóa đơn", success: false });
        }

        return res.json({
            msg: "Xác nhận thanh toán thành công",
            data: updatedHoaDon,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.json({ msg: "Đã xảy ra lỗi khi xác nhận thanh toán", success: false });
    }
};
const xacNhanThanhToanThatBaiApi = async (req, res, next) => {
    try {
        const id = req.params.id;
        const ghiChu = req.body.ghiChu;

        // Thực hiện cập nhật chỉ với các trường cần thiết
        const updatedHoaDon = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { ghiChu: ghiChu, trangThaiThanhToan: 0 } },
            { new: true }
        );

        if (!updatedHoaDon) {
            return res.json({ msg: "Không tìm thấy hóa đơn", success: false });
        }

        return res.json({
            msg: "Xác nhận thanh toán thất bại",
            data: updatedHoaDon,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.json({ msg: "Đã xảy ra lỗi khi xác nhận thanh toán", success: false });
    }
};


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
    xacNhanThanhToanChuyenKhoanApi,
    xacNhanThanhToanTienMatApi,
    xacNhanThanhToanThanhCongApi,
    xacNhanThanhToanThatBaiApi
};
