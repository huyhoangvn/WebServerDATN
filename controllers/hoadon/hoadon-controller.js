const { model: HoaDon } = require("../../model/HoaDon");

const moment = require('moment');

// Thêm mới hóa đơn
const addHoaDonApi = async (req, res, next) => {

    try {
        const { idKH, idNV, diaChiGiaoHang, thoiGianTao } = req.body;
        if (!idKH || !diaChiGiaoHang || !thoiGianTao) {
            return res.status(400).json({ msg: 'Vui lòng điền đầy đủ thông tin' });
        }
        let foundHoaDon = await HoaDon.findOne({ idKH, idNV, diaChiGiaoHang, thoiGianTao });
        if (foundHoaDon) {
            return res.status(400).json({ msg: "Hóa đơn đã tồn tại" });
        }
        await HoaDon.create({
            idKH,
            idNV,
            diaChiGiaoHang,
            thoiGianTao,
            xacNhanKhachHang: 0,
            trangThai: 0,
            trangThaiGiaoHang: 0,
            trangThaiDuyet: 0,
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
        const trangThai = true;
        const xacNhanKhachHang = 0;
        const trangThaiGiaoHang = 0;
        const trangThaiDuyet = 0;
        const trangThaiThanhToan = 0;

        const updateFields = {
            diaChiGiaoHang: diaChiGiaoHang,
            ghiChu: ghiChu,
            thoiGianTao: thoiGianTao,
            thoiGianGiaoHangDuKien: thoiGianGiaoHangDuKien,
            trangThai: trangThai,
            xacNhanKhachHang: xacNhanKhachHang,
            trangThaiGiaoHang: trangThaiGiaoHang,
            trangThaiDuyet: trangThaiDuyet,
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
            trangThaiGiaoHang,
            xacNhanKhachHang,
            trangThaiDuyet,
            thoiGianTao,
        } = req.query;
        let filter = {};

        if (trangThaiGiaoHang !== undefined) {
            filter.trangThaiGiaoHang = trangThaiGiaoHang;
        }
        if (xacNhanKhachHang !== undefined) {
            filter.xacNhanKhachHang = xacNhanKhachHang;
        }
        if (trangThaiThanhToan !== undefined) {
            filter.trangThaiThanhToan = trangThaiThanhToan;
        }
        if (trangThaiDuyet !== undefined) {
            filter.trangThaiDuyet = trangThaiDuyet;
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
const updateTrangThaiDuyet = async (req, res, next) => {
    try {
        const id = req.params.id;
        const trangThaiDuyet = req.body.trangThaiDuyet;
        if (trangThaiDuyet !== 0 && trangThaiDuyet !== 1 && trangThaiDuyet !== 2) {
            return res.status(400).json({ error: "Trạng thái duyệt không hợp lệ" });
        }
        const updateTrangThaiDuyet = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangThaiDuyet: trangThaiDuyet } },
            { new: true },
        );
        if (!updateTrangThaiDuyet) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        res.status(200).json({
            msg: "Đã hủy update",
            data: updateTrangThaiDuyet,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi update " });
    }
}
const updateTrangThanhToan = async (req, res, next) => {
    try {
        const id = req.params.id;
        const trangThaiThanhToan = req.body.trangThaiThanhToan;
        const updateTrangThaiThanhToan = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangThaiThanhToan: trangThaiThanhToan } },
            { new: true },
        );
        if (!updateTrangThaiThanhToan) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        res.status(200).json({
            msg: "Đã hủy update",
            data: updateTrangThaiThanhToan,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi update " });
    }
}
const updateXacNhanKhachHang = async (req, res, next) => {
    try {
        const idHoaDon = req.params.id;
        const xacNhanKhachHang = req.body.xacNhanKhachHang;
        const updateXacNhanKhachHang = await HoaDon.findOneAndUpdate(
            { _id: idHoaDon },
            { $set: { xacNhanKhachHang: xacNhanKhachHang } },
            { new: true },
        );
        if (!updateXacNhanKhachHang) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        res.status(200).json({
            msg: "Đã hủy update",
            data: updateXacNhanKhachHang,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi update " });
    }
}
const updateTrangThaiGiaoHang = async (req, res, next) => {
    try {
        const id = req.params.id;
        const trangThaiGiaoHang = req.body.trangThaiGiaoHang;
        const updateTrangThaiGiaoHang = await HoaDon.findOneAndUpdate(
            { _id: id },
            { $set: { trangThaiGiaoHang: trangThaiGiaoHang } },
            { new: true },
        );
        if (!updateTrangThaiGiaoHang) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        res.status(200).json({
            msg: "Đã hủy update",
            data: updateTrangThaiGiaoHang,
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

const updateTrangThaiDuyetApi = async (req, res, next) => {
    try {
        const result = await updateTrangThaiDuyet(req, res, next);
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
const updateTrangThaiThanhToanApi = async (req, res, next) => {
    try {
        const result = await updateTrangThanhToan(req, res, next);
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
const updatexacNhanKhachHangApi = async (req, res, next) => {
    try {
        const result = await updateXacNhanKhachHang(req, res, next);
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
const updateTrangThaiGiaoHangApi = async (req, res, next) => {
    try {
        const result = await updateTrangThaiGiaoHang(req, res, next);
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

// Export các hàm API
module.exports = {
    addHoaDonApi,
    deleteHoaDonApi,
    getHoaDonApi,
    chiTietHoaDonApi,
    updateHoaDonApi,
    updatexacNhanKhachHangApi,
    updateTrangThaiDuyetApi,
    updateTrangThaiGiaoHangApi,
    updateTrangThaiThanhToanApi

};
