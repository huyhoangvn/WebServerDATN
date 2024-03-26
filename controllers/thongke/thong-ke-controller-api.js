const { model: HoaDon } = require("../../model/HoaDon");
const mongo = require('mongoose');
const thongke = require('../../controllers/thongke/thong-ke-controller');

// api 
const thongKeDoanhThuTheoNgayApi = async (req, res, next) => {
    try {
        const result = await thongke.thongKeDoanhThuTheoNgay(req, res, next);
        res.status(200).json(result);
        // Send the result directly without using JSON.stringify

    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}
const thongKeDoanhThuTheo10NgayApi = async (req, res, next) => {
    try {
        const result = await thongke.thongKeDoanhThuTheo10Ngay(req, res, next);
        res.status(200).json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}
const thongKeDoanhThuTheo30NgayApi = async (req, res, next) => {
    try {
        const result = await thongke.thongKeDoanhThuTheo30Ngay(req, res, next);
        res.status(200).json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}

const thongKeDoanhThuTheoNamApi = async (req, res, next) => {
    try {
        const result = await thongke.thongKeDoanhThuTheoNam(req, res, next);
        res.status(200).json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}

const thongKeDoanhThuTheoThangTrongNamApi = async (req, res, next) => {
    try {
        const monthlyRevenue = await thongke.thongKeDoanhThuTheoThangTrongNam(req, res, next);
        res.status(200).json(monthlyRevenue);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}
// thống kê món bán chạy tất cả

const thongKeMonBanChay1NgayTatCaApi = async (req, res, next) => {
    try {
        const top10Result = await thongke.thongKeMonBanChay1Ngay(req, res, next);
        res.status(200).json(top10Result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}
const thongKeMonBanChay10NgayTatCaApi = async (req, res, next) => {
    try {
        const top10Result = await thongke.thongKeMonBanChay10Ngay(req, res, next);
        res.status(200).json(top10Result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}
const thongKeMonBanChay30NgayTatCaApi = async (req, res, next) => {
    try {
        const top10Result = await thongke.thongKeMonBanChay30Ngay(req, res, next);
        res.status(200).json(top10Result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}

// thống kê món bán chạy theo tên loại món
const thongKeMonBanChay1NgayTheoTenLoaiMonApi = async (req, res, next) => {
    try {
        const top10Result = await thongke.thongKeMonBanChay1NgayTheoTenLoaiMon(req, res, next);
        res.status(200).json(top10Result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}
const thongKeMonBanChay10NgayTheoTenLoaiMonApi = async (req, res, next) => {
    try {
        const top10Result = await thongke.thongKeMonBanChay10NgayTheoTenLoaiMon(req, res, next);
        res.status(200).json(top10Result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}
const thongKeMonBanChay30NgayTheoTenLoaiMonApi = async (req, res, next) => {
    try {
        const top10Result = await thongke.thongKeMonBanChay30NgayTheoTenLoaiMon(req, res, next);
        res.status(200).json(top10Result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}

module.exports = {
    //thống kê doanh thu
    thongKeDoanhThuTheoNgayApi,
    thongKeDoanhThuTheo10NgayApi,
    thongKeDoanhThuTheo30NgayApi,
    thongKeDoanhThuTheoNamApi,
    thongKeDoanhThuTheoThangTrongNamApi,

    // thống kê món bán chạy tất cả
    thongKeMonBanChay1NgayTatCaApi,
    thongKeMonBanChay10NgayTatCaApi,
    thongKeMonBanChay30NgayTatCaApi,

    // thống kê món bán chạy theo tên loại món
    thongKeMonBanChay1NgayTheoTenLoaiMonApi,
    thongKeMonBanChay10NgayTheoTenLoaiMonApi,
    thongKeMonBanChay30NgayTheoTenLoaiMonApi,

}