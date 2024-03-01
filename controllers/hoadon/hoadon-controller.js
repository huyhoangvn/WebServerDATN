const { model: HoaDon } = require("../../model/HoaDon");

const moment = require('moment');

// Thêm mới hóa đơn
const addHoaDonApi = async (req, res, next) => {

    try {
        const { idKH, idCH, diaChiGiaoHang } = req.body;
        if (!idKH || !diaChiGiaoHang || !idCH) {
            return res.status(400).json({ msg: 'Vui lòng điền đầy đủ thông tin' });
        }
        let foundHoaDon = await HoaDon.findOne({ idKH, idCH, diaChiGiaoHang });
        if (foundHoaDon) {
            return res.status(400).json({ msg: "Hóa đơn đã tồn tại" });
        }
        await HoaDon.create({
            idKH,
            idCH,
            diaChiGiaoHang,
            trangThaiMua: 0,
            trangThai: true,
            trangThaiThanhToan: 0,
        });
        res.status(201).json({ message: "Thêm mới hóa đơn thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi thêm mới hóa đơn", error });
    }
};

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
            trangThai,
            trangThaiThanhToan,
            trangThaiMua,
            thoiGianTao,
        } = req.query;
        let filter = {};

        if (trangThaiThanhToan !== undefined) {
            filter.trangThaiThanhToan = trangThaiThanhToan;
        }
        if (trangThaiMua !== undefined) {
            filter.trangThaiMua = trangThaiMua;
        }
        if (trangThai !== undefined) {
            filter.trangThai = trangThai;
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

        res.json({ data: danhSachHoaDon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn' });
    }
}
const chiTietHoaDon = async (req, res, next) => {
    try {
        const id = req.params.id;
        const item = await HoaDon.findById(id)
        if (!item) {
            res.status(500).json({ error: "không tìm thấy Hoa Đơn chi tiết" });
        }
        res.status(200).json({
            msg: "Lấy chi tiết thành công",
            data: item,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi lấy chi tiết hóa đơn" });
    }
};
const updatetrangThaiThanhToan = async (req, res, next) => {
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
        res.status(200).json({
            msg: "update thành công",
            data: updatetrangThaiThanhToan,
        });
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
        res.status(200).json({
            msg: "update thành công",
            data: updatetrangThaiMua,
        });
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
        res.status(200).json({
            msg: "update thành công",
            data: updatetrangThaiMua,
        });
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
            { $set: { trangtrangThaiMua: 3 } },
            { new: true },
        );
        if (!updatetrangThaiMua) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        res.status(200).json({
            msg: "update thành công",
            data: updatetrangThaiMua,
        });
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
            { $set: { trangtrangThaiMua: 4 } },
            { new: true },
        );
        if (!updatetrangThaiMua) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        res.status(200).json({
            msg: "update thành công",
            data: updatetrangThaiMua,
        });
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

        res.status(200).json({
            msg: "Đã xoa hoa don thanh công",
            data: deleteHoaDon,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi xóa hóa đơn" });
    }
};
//api
const updateHoaDonApi = async (req, res, next) => {
    try {
        const result = await updateHoaDon(req, res, next);
        if (!res.headersSent) {
            // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi
            res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
        } else {
            console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi kết quả.");
        };
    } catch (error) {
        // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi lỗi
        if (!res.headersSent) {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
        } else {
            console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        }
    }
}
const getHoaDonApi = async (req, res, next) => {
    try {
        const result = await getHoaDon(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}


const chiTietHoaDonApi = async (req, res, next) => {
    try {
        const result = await chiTietHoaDon(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}

const updatetrangThaiThanhToanApi = async (req, res, next) => {
    try {
        const result = await updatetrangThaiThanhToan(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}
const updatetrangThaiMuaDangChuanBiApi = async (req, res, next) => {
    try {
        const result = await updatetrangThaiMuaDangChuanBi(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}
const updatetrangThaiMuaDangGiaoHangApi = async (req, res, next) => {
    try {
        const result = await updatetrangThaiMuaDangGiaoHang(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}
const updatetrangThaiMuaGiaoHangThatBaiApi = async (req, res, next) => {
    try {
        const result = await updatetrangThaiMuaGiaoHangThatBai(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}
const updatetrangThaiMuaGiaoHangThanhCongApi = async (req, res, next) => {
    try {
        const result = await updatetrangThaiMuaGiaoHangThanhCong(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}


const deleteHoaDonApi = async (req, res, next) => {
    try {
        const result = await deleteHoaDon(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi xóa Hóa Đơn', error: error.message });
        }
    }
}
const getDanhSachHoaDonByIdKhachHangApi = async (req, res, next) => {
    try {
        const idKhachHang = req.params.id; // Lấy ID của khách hàng từ tham số trong đường dẫn

        // Kiểm tra tính hợp lệ của ID khách hàng
        if (!idKhachHang) {
            return res.status(400).json({ msg: 'Vui lòng cung cấp ID khách hàng' });
        }

        // Lấy danh sách hóa đơn của khách hàng dựa trên ID
        const danhSachHoaDon = await HoaDon.find({ idKH: idKhachHang });

        // Trả về danh sách hóa đơn
        res.json({ data: danhSachHoaDon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn của khách hàng', error: error.message });
    }
};
const getDanhSachHoaDonByIdCuaHangApi = async (req, res, next) => {
    try {
        const idCuaHang = req.params.id; // Lấy ID của khách hàng từ tham số trong đường dẫn

        // Kiểm tra tính hợp lệ của ID khách hàng
        if (!idCuaHang) {
            return res.status(400).json({ msg: 'Vui lòng cung cấp ID cửa hàng' });
        }

        // Lấy danh sách hóa đơn của khách hàng dựa trên ID
        const danhSachHoaDon = await HoaDon.find({ idCH: idCuaHang });

        // Trả về danh sách hóa đơn
        res.json({ data: danhSachHoaDon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn của cửa hàng', error: error.message });
    }
};

// Export các hàm API
module.exports = {
    addHoaDonApi,
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
};
