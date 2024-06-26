const { model: HoaDon } = require("../../model/HoaDon");
const mongo = require('mongoose');
const thongke = require('../../controllers/thongke/thong-ke-controller');

const moment = require('moment');
// api 
const thongKeDoanhThuTheoNgayApi = async (req, res, next) => {
    try {
        const result = await thongke.thongKeDoanhThuTheoNgay(req, res, next);
        res.json(result);
        // Send the result directly without using JSON.stringify

    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}
const thongKeDoanhThuTheo10NgayApi = async (req, res, next) => {
    try {
        const result = await thongke.thongKeDoanhThuTheo10Ngay(req, res, next);
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
const thongKeDoanhThuTheo30NgayApi = async (req, res, next) => {
    try {
        const result = await thongke.thongKeDoanhThuTheo30Ngay(req, res, next);
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

const thongKeDoanhThuTheoNamApi = async (req, res, next) => {
    try {
        const result = await thongke.thongKeDoanhThuTheoNam(req, res, next);
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

const thongKeDoanhThuTheoThangTrongNamApi = async (req, res, next) => {
    try {
        const monthlyRevenue = await thongke.thongKeDoanhThuTheoThangTrongNam(req, res, next);
        res.json(monthlyRevenue);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}

// by cửa hàng

const thongKeDoanhThuTheoNgayByCHApi = async (req, res, next) => {
    try {
        const result = await thongke.thongKeDoanhThuTheoNgaybyCH(req, res, next);
        res.json(result);
        // Send the result directly without using JSON.stringify

    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}
const thongKeDoanhThuTheo10NgayByCHApi = async (req, res, next) => {
    try {
        const result = await thongke.thongKeDoanhThuTheo10NgaybyCH(req, res, next);
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
const thongKeDoanhThuTheo30NgayByCHApi = async (req, res, next) => {
    try {
        const result = await thongke.thongKeDoanhThuTheo30NgaybyCH(req, res, next);
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

const thongKeDoanhThuTheoNamByCHApi = async (req, res, next) => {
    try {
        const result = await thongke.thongKeDoanhThuTheoNambyCH(req, res, next);
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

const thongKeDoanhThuTheoThangTrongNamByCHApi = async (req, res, next) => {
    try {
        const monthlyRevenue = await thongke.thongKeDoanhThuTheoThangTrongNambyCH(req, res, next);
        res.json(monthlyRevenue);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}

// thống kê món bán chạy theo tên loại món
const thongKeMonBanChayTheoTenLoaiMonApi = async (req, res, next) => {
    try {
        const top10Result = await thongke.thongKeMonBanChayTheoTenLoaiMon(req, res, next);
        res.json(top10Result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}
const thongKeMonBanChayTheoNamApi = async (req, res, next) => {
    try {
        const top10Result = await thongke.thongKeMonBanChayTheoNam(req, res, next);
        res.json(top10Result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}


const thongKeDoanhThuTheoNgaytoNgayApi = async (req, res, next) => {
    try {
        const index = await thongke.thongKeDoanhThuTheoNgayToNgay(req, res, next);
        res.json(index);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}

const thongKeDoanhThuTheoNgaytoNgaybyCHApi = async (req, res, next) => {
    try {
        const index = await thongke.thongKeDoanhThuTheoNgayToNgaybyCH(req, res, next);
        res.json(index);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}

const thongKeMonBanChayApi = async (req, res, next) => {
    try {
        const index = await thongke.thongKeMonBanChay(req, res, next);
        res.json(index);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
        }
    }
}
const thongKeMonBanChayWebApi = async (req, res, next) => {
    try {
        const index = await thongke.thongKeMonBanChayWeb(req, res, next);
        res.json(index);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt hóa đơn', error: error.message });
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

    thongKeDoanhThuTheoNgayByCHApi,
    thongKeDoanhThuTheo10NgayByCHApi,
    thongKeDoanhThuTheo30NgayByCHApi,
    thongKeDoanhThuTheoNamByCHApi,
    thongKeDoanhThuTheoThangTrongNamByCHApi,
    thongKeDoanhThuTheoNgaytoNgaybyCHApi,

    // thống kê món bán chạy theo tên loại món
    thongKeMonBanChayTheoTenLoaiMonApi,
    thongKeMonBanChayTheoNamApi,
    thongKeDoanhThuTheoNgaytoNgayApi,
    thongKeMonBanChayApi,
    thongKeMonBanChayWebApi

}