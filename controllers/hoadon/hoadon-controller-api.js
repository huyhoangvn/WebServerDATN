const { model: HoaDon } = require("../../model/HoaDon");
const { model: CuaHang } = require("../../model/CuaHang");
const { model: KhachHang } = require("../../model/KhachHang");
const HoaDonController = require("../../controllers/hoadon/hoadon-controller");


const addHoaDonApi = async (req, res, next) => {

    try {
        const { idKH, idCH, diaChiGiaoHang } = req.body;
        if (!idKH || !idCH || !diaChiGiaoHang) {
            return res.status(400).json({ msg: 'Vui lòng điền đầy đủ thông tin' });
        }

        const khachHang = await KhachHang.findById(idKH);
        if (!khachHang || !khachHang.trangThai) {
            return res.status(400).json({ msg: "Khách hàng không tồn tại hoặc không có trạng thái đúng" });
        }
        // Kiểm tra xem cửa hàng có tồn tại không
        const cuaHang = await CuaHang.findById(idCH);
        if (!cuaHang || !cuaHang.trangThai) {
            return res.status(400).json({ msg: "Khách hàng không tồn tại hoặc không có trạng thái đúng" });
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
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
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
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
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
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}

const updatetrangThaiThanhToanTrueApi = async (req, res, next) => {
    try {
        const result = await HoaDonController.updatetrangThaiThanhToanTrue(req, res, next);
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

const updatetrangThaiThanhToanFalseApi = async (req, res, next) => {
    try {
        const result = await HoaDonController.updatetrangThaiThanhToanFalse(req, res, next);
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
        const result = await HoaDonController.updatetrangThaiMuaDangChuanBi(req, res, next);
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
        const result = await HoaDonController.updatetrangThaiMuaDangGiaoHang(req, res, next);
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
        const result = await HoaDonController.updatetrangThaiMuaGiaoHangThatBai(req, res, next);
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
        const result = await HoaDonController.updatetrangThaiMuaGiaoHangThanhCong(req, res, next);
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
        const result = await HoaDonController.deleteHoaDon(req, res, next);
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
        res.json({
            data: danhSachHoaDon,
            count: danhSachHoaDon.length,
            msg: "thành công",
            success: true,
        });
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
        res.json({
            data: danhSachHoaDon,
            count: danhSachHoaDon.length,
            msg: "thành công",
            success: true,
        });
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
    updatetrangThaiThanhToanTrueApi,
    updatetrangThaiThanhToanFalseApi,
    updatetrangThaiMuaDangChuanBiApi,
    updatetrangThaiMuaDangGiaoHangApi,
    updatetrangThaiMuaGiaoHangThatBaiApi,
    updatetrangThaiMuaGiaoHangThanhCongApi,
};
