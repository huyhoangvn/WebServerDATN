const { model: HoaDon } = require("../../model/HoaDon");
const mongo = require('mongoose');

const moment = require('moment');

const thongKeDoanhThuTheoNgay = async (req, res, next) => {
    try {
        // Lấy ngày hôm qua
        const startDate = moment().utc().startOf('day').toDate();
        const endDate = moment().utc().subtract(1, 'days').endOf('day').toDate();

        const result = await HoaDon.aggregate([
            {
                $addFields: {
                    thoiGianTaoString: { $dateToString: { format: "%Y/%m/%d", date: "$thoiGianTao" } },
                    startDateString: { $dateToString: { format: "%Y/%m/%d", date: startDate } }
                }
            },
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTaoString", "$startDateString"] }, // Hóa đơn được tạo trong ngày hôm nay
                            { $lte: ["$thoiGianTaoString", endDate] },
                            { $eq: ["$trangThaiMua", 3] }, // Trạng thái mua là 3
                            { $eq: ["$trangThaiThanhToan", 1] }, // Trạng thái thanh toán là đã thanh toán
                            { $eq: ["$trangThai", true] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y/%m/%d", date: "$thoiGianTao" } }, // Group theo ngày (năm-tháng-ngày)
                    tongTien: { $sum: "$tongTien" } // Tính tổng tiền
                }
            },
            {
                $sort: { _id: 1 } // Sắp xếp kết quả theo ngày tăng dần
            }
        ]);
        const tongTienTongHop = result.reduce((accumulator, currentValue) => accumulator + currentValue.tongTien, 0);

        return {
            index: result,
            tongTien: tongTienTongHop,
            success: true,
            msg: "thành công"
        }
    } catch (error) {
        console.error("Error:", error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi khi thực hiện thống kê.'
        };
    }
};

const thongKeDoanhThuTheo10Ngay = async (req, res, next) => {
    try {
        // Lấy 10 ngày trước
        const startDate10 = moment().utc().subtract(10, 'days').startOf('day').toDate();
        const endDate10 = moment().utc().subtract(1, 'days').endOf('day').toDate();

        const result = await HoaDon.aggregate([
            {
                $addFields: {
                    thoiGianTaoString: { $dateToString: { format: "%Y/%m/%d", date: "$thoiGianTao" } },
                    startDateString: { $dateToString: { format: "%Y/%m/%d", date: startDate10 } }
                }
            },
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTaoString", "$startDateString"] }, // Hóa đơn được tạo trong ngày hôm nay
                            { $lte: ["$thoiGianTaoString", endDate10] },
                            { $eq: ["$trangThaiMua", 3] }, // Trạng thái mua là 3
                            { $eq: ["$trangThaiThanhToan", 1] }, // Trạng thái thanh toán là đã thanh toán
                            { $eq: ["$trangThai", true] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y/%m/%d", date: "$thoiGianTao" } }, // Group theo ngày (năm-tháng-ngày)
                    tongTien: { $sum: "$tongTien" } // Tính tổng tiền
                }
            },
            {
                $sort: { _id: 1 } // Sắp xếp kết quả theo ngày tăng dần
            }
        ]);

        const tongTienTongHop = result.reduce((accumulator, currentValue) => accumulator + currentValue.tongTien, 0);

        return {
            index: result,
            tongTien: tongTienTongHop,
            success: true,
            msg: "thành công"
        }
    } catch (error) {
        console.error("Error:", error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi khi thực hiện thống kê.'
        };
    }
};



const thongKeDoanhThuTheo30Ngay = async (req, res, next) => {
    try {
        // Lấy 30 ngày hôm qua
        const startDate30 = moment().utc().subtract(30, 'days').startOf('day').toDate();
        const endDate30 = moment().utc().subtract(1, 'days').endOf('day').toDate();


        const result = await HoaDon.aggregate([
            {
                $addFields: {
                    thoiGianTaoString: { $dateToString: { format: "%Y/%m/%d", date: "$thoiGianTao" } },
                    startDateString: { $dateToString: { format: "%Y/%m/%d", date: startDate30 } }
                }
            },
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTaoString", "$startDateString"] }, // Hóa đơn được tạo trong ngày hôm nay
                            { $lte: ["$thoiGianTaoString", endDate30] },
                            { $eq: ["$trangThaiMua", 3] }, // Trạng thái mua là 3
                            { $eq: ["$trangThaiThanhToan", 1] },// Trạng thái thanh toán là đã thanh toán
                            { $eq: ["$trangThai", true] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y/%m/%d", date: "$thoiGianTao" } }, // Group theo ngày (năm-tháng-ngày)
                    tongTien: { $sum: "$tongTien" } // Tính tổng tiền
                }
            },
            {
                $sort: { _id: 1 } // Sắp xếp kết quả theo ngày tăng dần
            }
        ]);
        const tongTienTongHop = result.reduce((accumulator, currentValue) => accumulator + currentValue.tongTien, 0);

        return {
            index: result,
            tongTien: tongTienTongHop,
            success: true,
            msg: "thành công"
        }
    } catch (error) {
        console.error("Error:", error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi khi thực hiện thống kê.'
        };
    }
};

const thongKeDoanhThuTheoNam = async (req, res, next) => {
    try {
        // Lấy năm được nhập từ request hoặc thay thế bằng năm cụ thể
        const nam = req.query.nam || new Date().getFullYear().toString();
        // const nam = req.params.nam

        // Tạo ngày bắt đầu và ngày kết thúc của năm được nhập
        const startDate = moment(`${nam}-01-01`).startOf('year').toDate();
        const endDate = moment(`${nam}-12-31`).endOf('year').toDate();

        const result = await HoaDon.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTao", startDate] }, // Hóa đơn được tạo trong năm được nhập
                            { $lte: ["$thoiGianTao", endDate] },
                            { $eq: ["$trangThaiMua", 3] }, // Trạng thái mua là 3
                            { $eq: ["$trangThaiThanhToan", 1] }, // Trạng thái thanh toán là đã thanh toán
                            { $eq: ["$trangThai", true] } // Trạng thái là true
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: nam,
                    tongTien: { $sum: "$tongTien" } // Tính tổng tiền của tất cả các hóa đơn
                }
            }
        ]);

        // Trả về tổng tiền của các hóa đơn thỏa mãn điều kiện trong năm
        return {
            index: result,
            success: true,
            msg: "thành công"
        }
    } catch (error) {
        console.error("Error:", error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi khi thực hiện thống kê.'
        };
    }
};

const thongKeDoanhThuTheoThangTrongNam = async (req, res, next) => {
    try {
        // Nhận năm từ request params
        const nam = req.params.nam;

        if (!nam) {
            return res.status(400).json({ message: 'Yêu cầu cung cấp năm.' });
        }

        // Tạo mảng chứa tên của các tháng
        const monthNames = [
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
            "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        ];

        // Khởi tạo mảng để lưu trữ doanh thu của từng tháng
        const monthlyRevenue = {};

        // Lặp qua từng tháng trong năm
        for (let month = 0; month < 12; month++) {
            // Tính ngày đầu tiên và cuối cùng của tháng
            const startDate = moment(`${nam}-${month + 1}-01`).startOf('month').toDate();
            const endDate = moment(startDate).endOf('month').toDate();

            // Thực hiện truy vấn để lấy tổng doanh thu của tháng đó
            const result = await HoaDon.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $gte: ["$thoiGianTao", startDate] },
                                { $lte: ["$thoiGianTao", endDate] },
                                { $eq: ["$trangThaiMua", 3] },
                                { $eq: ["$trangThaiThanhToan", 1] },
                                { $eq: ["$trangThai", true] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        tongTien: { $sum: "$tongTien" }
                    }
                }
            ]);

            // Lưu tổng doanh thu vào mảng monthlyRevenue
            if (result.length > 0) {
                monthlyRevenue[monthNames[month]] = result[0].tongTien;
            } else {
                monthlyRevenue[monthNames[month]] = 0;
            }
        }

        // Gửi kết quả dưới dạng đối tượng JSON
        return {
            index: monthlyRevenue,
            success: true,
            msg: "thành công"
        }
    } catch (error) {
        console.error("Error:", error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi khi thực hiện thống kê.'
        };
    }
};
// Thông kê món

module.exports = {
    thongKeDoanhThuTheoNgay,
    thongKeDoanhThuTheo10Ngay,
    thongKeDoanhThuTheo30Ngay,
    thongKeDoanhThuTheoNam,
    thongKeDoanhThuTheoThangTrongNam

}