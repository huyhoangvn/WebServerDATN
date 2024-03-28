const { model: HoaDon } = require("../../model/HoaDon");
const { model: MonDat } = require("../../model/MonDat");
const { model: LoaiMon } = require("../../model/LoaiMon");
const mongo = require('mongoose');

const moment = require('moment');

const thongKeDoanhThuTheoNgay = async (req, res, next) => {
    try {
        // Lấy ngày cụ thể, ví dụ: ngày hôm nay
        const currentDate = moment().utc().startOf('day').toDate();

        const result = await HoaDon.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTao", currentDate] }, // Hóa đơn được tạo trong ngày hôm nay hoặc sau ngày hôm nay
                            { $lt: ["$thoiGianTao", moment(currentDate).add(1, 'days').toDate()] }, // Hóa đơn được tạo trước ngày hôm sau
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
            }
        ]);

        // Lấy kết quả cho ngày cụ thể
        const filteredResult = result.find(item => item._id === moment(currentDate).format("YYYY/MM/DD"));

        // Tính tổng tiền
        const tongTien = filteredResult ? filteredResult.tongTien : 0;

        return {
            tongTien: tongTien,
            success: true,
            msg: "Thành công"
        };
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
        // Lấy ngày cụ thể, ví dụ: ngày hôm nay
        const currentDate = moment().utc().startOf('day').toDate();

        // Lấy ngày 10 ngày trước
        const startDate = moment(currentDate).subtract(10, 'days').startOf('day').toDate();

        const result = await HoaDon.aggregate([

            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTao", startDate] }, // Hóa đơn được tạo từ ngày startDate
                            { $lt: ["$thoiGianTao", moment(currentDate).add(1, 'days').toDate()] }, // Hóa đơn được tạo trước ngày hôm sau
                            { $eq: ["$trangThaiMua", 3] }, // Trạng thái mua là 3
                            { $eq: ["$trangThaiThanhToan", 1] }, // Trạng thái thanh toán là đã thanh toán
                            { $eq: ["$trangThai", true] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    tongTien: { $sum: "$tongTien" } // Tính tổng tiền
                }

            }
        ]);

        // Tính tổng tiền
        const tongTien = result.length > 0 ? result[0].tongTien : 0;

        return {
            tongTien: tongTien,
            success: true,
            msg: "Thành công"
        };
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
        // Lấy ngày cụ thể, ví dụ: ngày hôm nay
        const currentDate = moment().utc().startOf('day').toDate();

        // Lấy ngày 30 ngày trước
        const startDate = moment(currentDate).subtract(30, 'days').startOf('day').toDate();

        const result = await HoaDon.aggregate([

            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTao", startDate] }, // Hóa đơn được tạo từ ngày startDate
                            { $lt: ["$thoiGianTao", moment(currentDate).add(1, 'days').toDate()] }, // Hóa đơn được tạo trước ngày hôm sau
                            { $eq: ["$trangThaiMua", 3] }, // Trạng thái mua là 3
                            { $eq: ["$trangThaiThanhToan", 1] }, // Trạng thái thanh toán là đã thanh toán
                            { $eq: ["$trangThai", true] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    tongTien: { $sum: "$tongTien" } // Tính tổng tiền
                }

            }
        ]);

        // Tính tổng tiền
        const tongTien = result.length > 0 ? result[0].tongTien : 0;

        return {
            tongTien: tongTien,
            success: true,
            msg: "Thành công"
        };
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
        const tongTien = result.length > 0 ? result[0].tongTien : 0;

        // Trả về tổng tiền của các hóa đơn thỏa mãn điều kiện trong năm
        return {
            index: tongTien,
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
        const nam = req.query.nam;

        if (!nam) {
            return res.status(400).json({ message: 'Yêu cầu cung cấp năm.' });
        }

        // Tạo mảng chứa tên của các tháng
        const monthNames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        // Khởi tạo mảng để lưu trữ doanh thu của từng tháng
        const monthlyRevenue = [];

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
            const monthRevenueObj = { month: monthNames[month], tong: 0 };
            if (result.length > 0) {
                monthRevenueObj.tong = result[0].tongTien;
            }
            monthlyRevenue.push(monthRevenueObj);
        }

        // Gửi kết quả dưới dạng mảng
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
// Thông kê món bán chạy tất cả

const thongKeMonBanChay1Ngay = async () => {
    try {

        const currentDate = moment().utc().startOf('day').toDate();

        // Bước 1: Lấy danh sách các hóa đơn phù hợp với điều kiện
        const hoaDon = await HoaDon.aggregate([

            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTao", currentDate] }, // Hóa đơn được tạo trong ngày hôm nay hoặc sau ngày hôm nay
                            { $lt: ["$thoiGianTao", moment(currentDate).add(1, 'days').toDate()] }, // 
                            { $eq: ["$trangThaiMua", 3] }, // Trạng thái mua là 3
                            { $eq: ["$trangThaiThanhToan", 1] }, // Trạng thái thanh toán là đã thanh toán
                            { $eq: ["$trangThai", true] }
                        ]
                    }
                }
            }
        ]);
        // Bước 2: Trích xuất danh sách idHD từ kết quả hoaDon
        const idHDs = hoaDon.map(item => item._id);
        // Bước 3: Lấy danh sách các món đặt tương ứng với các hóa đơn đã lọc
        const result = await MonDat.aggregate([
            { $match: { idHD: { $in: idHDs } } }, // Chỉ lấy các món đặt có idHD trong danh sách idHDs
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
            { $unwind: "$loaiMon" }
        ]);

        // Bước 4: Tính toán và sắp xếp kết quả
        const finalResult = result.reduce((accumulator, currentValue) => {
            const index = accumulator.findIndex(item => item._id.toString() === currentValue.idMon.toString());
            if (index === -1) {
                accumulator.push({
                    _id: currentValue.idMon,
                    tenMon: currentValue.mon.tenMon,
                    tenLoaiMon: currentValue.loaiMon.tenLoaiMon,
                    soLuong: currentValue.soLuong,
                    doanhThu: currentValue.giaTienDat * currentValue.soLuong
                });
            } else {
                accumulator[index].soLuong += currentValue.soLuong;
                accumulator[index].doanhThu += currentValue.giaTienDat * currentValue.soLuong;
            }
            return accumulator;
        }, []);

        // Sắp xếp kết quả theo số lượng giảm dần và giới hạn số lượng kết quả trả về là 10
        finalResult.sort((a, b) => b.soLuong - a.soLuong);
        const top10Result = finalResult.slice(0, 10);


        return {
            data: top10Result,
            success: true,
            message: 'Thành công'
        };
    } catch (error) {
        console.error("Lỗi:", error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi khi thực hiện thống kê.'
        };
    }
};
const thongKeMonBanChay10Ngay = async () => {
    try {
        // Lấy ngày hôm qua
        const currentDate = moment().utc().startOf('day').toDate();

        // Lấy ngày 10 ngày trước
        const startDate = moment(currentDate).subtract(10, 'days').startOf('day').toDate();

        // Bước 1: Lấy danh sách các hóa đơn phù hợp với điều kiện
        const hoaDon = await HoaDon.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTao", startDate] }, // Hóa đơn được tạo trong ngày hôm nay
                            { $lte: ["$thoiGianTao", moment(currentDate).add(1, 'days').toDate()] },
                            { $eq: ["$trangThaiMua", 3] }, // Trạng thái mua là 3
                            { $eq: ["$trangThaiThanhToan", 1] }, // Trạng thái thanh toán là đã thanh toán
                            { $eq: ["$trangThai", true] }
                        ]
                    }
                }
            }
        ]);
        // Bước 2: Trích xuất danh sách idHD từ kết quả hoaDon
        const idHDs = hoaDon.map(item => item._id);
        // Bước 3: Lấy danh sách các món đặt tương ứng với các hóa đơn đã lọc
        const result = await MonDat.aggregate([
            { $match: { idHD: { $in: idHDs } } }, // Chỉ lấy các món đặt có idHD trong danh sách idHDs
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
            { $unwind: "$loaiMon" }
        ]);

        // Bước 4: Tính toán và sắp xếp kết quả
        const finalResult = result.reduce((accumulator, currentValue) => {
            const index = accumulator.findIndex(item => item._id.toString() === currentValue.idMon.toString());
            if (index === -1) {
                accumulator.push({
                    _id: currentValue.idMon,
                    tenMon: currentValue.mon.tenMon,
                    tenLoaiMon: currentValue.loaiMon.tenLoaiMon,
                    soLuong: currentValue.soLuong,
                    doanhThu: currentValue.giaTienDat * currentValue.soLuong
                });
            } else {
                accumulator[index].soLuong += currentValue.soLuong;
                accumulator[index].doanhThu += currentValue.giaTienDat * currentValue.soLuong;
            }
            return accumulator;
        }, []);

        // Sắp xếp kết quả theo số lượng giảm dần và giới hạn số lượng kết quả trả về là 10
        finalResult.sort((a, b) => b.soLuong - a.soLuong);
        const top10Result = finalResult.slice(0, 10);


        return {
            data: top10Result,
            success: true,
            message: 'Thành công'
        };
    } catch (error) {
        console.error("Lỗi:", error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi khi thực hiện thống kê.'
        };
    }
};
const thongKeMonBanChay30Ngay = async () => {
    try {
        // Lấy ngày hôm qua
        const currentDate = moment().utc().startOf('day').toDate();

        // Lấy ngày 10 ngày trước
        const startDate = moment(currentDate).subtract(30, 'days').startOf('day').toDate();

        // Bước 1: Lấy danh sách các hóa đơn phù hợp với điều kiện
        const hoaDon = await HoaDon.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTao", startDate] }, // Hóa đơn được tạo trong ngày hôm nay
                            { $lte: ["$thoiGianTao", moment(currentDate).add(1, 'days').toDate()] },
                            { $eq: ["$trangThaiMua", 3] }, // Trạng thái mua là 3
                            { $eq: ["$trangThaiThanhToan", 1] }, // Trạng thái thanh toán là đã thanh toán
                            { $eq: ["$trangThai", true] }
                        ]
                    }
                }
            }
        ]);
        // Bước 2: Trích xuất danh sách idHD từ kết quả hoaDon
        const idHDs = hoaDon.map(item => item._id);
        // Bước 3: Lấy danh sách các món đặt tương ứng với các hóa đơn đã lọc
        const result = await MonDat.aggregate([
            { $match: { idHD: { $in: idHDs } } }, // Chỉ lấy các món đặt có idHD trong danh sách idHDs
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
            { $unwind: "$loaiMon" }
        ]);

        // Bước 4: Tính toán và sắp xếp kết quả
        const finalResult = result.reduce((accumulator, currentValue) => {
            const index = accumulator.findIndex(item => item._id.toString() === currentValue.idMon.toString());
            if (index === -1) {
                accumulator.push({
                    _id: currentValue.idMon,
                    tenMon: currentValue.mon.tenMon,
                    tenLoaiMon: currentValue.loaiMon.tenLoaiMon,
                    soLuong: currentValue.soLuong,
                    doanhThu: currentValue.giaTienDat * currentValue.soLuong
                });
            } else {
                accumulator[index].soLuong += currentValue.soLuong;
                accumulator[index].doanhThu += currentValue.giaTienDat * currentValue.soLuong;
            }
            return accumulator;
        }, []);

        // Sắp xếp kết quả theo số lượng giảm dần và giới hạn số lượng kết quả trả về là 10
        finalResult.sort((a, b) => b.soLuong - a.soLuong);
        const top10Result = finalResult.slice(0, 10);


        return {
            data: top10Result,
            success: true,
            message: 'Thành công'
        };
    } catch (error) {
        console.error("Lỗi:", error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi khi thực hiện thống kê.'
        };
    }
};

// thống kê món bán chạy theo query tên loại món


const thongKeMonBanChay1NgayTheoTenLoaiMon = async (req, res) => {
    try {
        const tenLM = req.query.tenLM;
        const currentDate = moment().utc().startOf('day').toDate();

        // Bước 1: Lấy ID của loại món dựa trên tên loại món
        const loaiMon = await LoaiMon.findOne({ tenLM: tenLM });
        if (!loaiMon) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy loại món có tên này."
            });
        }

        // Bước 2: Lấy danh sách các hóa đơn phù hợp với điều kiện
        const hoaDon = await HoaDon.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTao", currentDate] }, // Hóa đơn được tạo trong ngày hôm nay
                            { $lte: ["$thoiGianTao", moment(currentDate).add(1, 'days').toDate()] },
                            { $eq: ["$trangThaiMua", 3] }, // Trạng thái mua là 3
                            { $eq: ["$trangThaiThanhToan", 1] }, // Trạng thái thanh toán là đã thanh toán
                            { $eq: ["$trangThai", true] }
                        ]
                    }
                }
            }
        ]);

        // Bước 3: Lấy danh sách các món đặt tương ứng với các hóa đơn đã lọc và có cùng loại món
        const result = await MonDat.aggregate([
            {
                $match: { idHD: { $in: hoaDon.map(hd => hd._id) } }
            },
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
                $match: { "mon.idLM": loaiMon._id }
            },

        ]);

        // Bước 4: Tính toán số lượng và doanh thu của từng món
        const finalResult = result.reduce((accumulator, currentValue) => {
            const index = accumulator.findIndex(item => item._id.toString() === currentValue.idMon.toString());
            if (index === -1) {
                accumulator.push({
                    _id: currentValue.idMon,
                    tenMon: currentValue.mon.tenMon,
                    tenLoaiMon: tenLM,
                    soLuong: currentValue.soLuong,
                    doanhThu: currentValue.giaTienDat * currentValue.soLuong
                });
            } else {
                accumulator[index].soLuong += currentValue.soLuong;
                accumulator[index].doanhThu += currentValue.giaTienDat * currentValue.soLuong;
            }
            return accumulator;
        }, []);

        // Sắp xếp kết quả theo số lượng giảm dần
        finalResult.sort((a, b) => b.soLuong - a.soLuong);

        // Giới hạn số lượng kết quả trả về là 10
        const top10Result = finalResult.slice(0, 10);

        return {
            data: top10Result,
            success: true,
            message: "Thành công"
        };
    } catch (error) {
        console.error("Lỗi:", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi thực hiện thống kê."
        });
    }
};

const thongKeMonBanChay10NgayTheoTenLoaiMon = async (req, res) => {
    try {
        const tenLM = req.query.tenLM;

        const currentDate = moment().utc().startOf('day').toDate();

        // Lấy ngày 10 ngày trước
        const startDate = moment(currentDate).subtract(10, 'days').startOf('day').toDate();

        // Bước 1: Lấy ID của loại món dựa trên tên loại món
        const loaiMon = await LoaiMon.findOne({ tenLM: tenLM });
        if (!loaiMon) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy loại món có tên này."
            });
        }

        // Bước 2: Lấy danh sách các hóa đơn phù hợp với điều kiện
        const hoaDon = await HoaDon.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTaoString", startDate] }, // Hóa đơn được tạo trong ngày hôm nay
                            { $lte: ["$thoiGianTaoString", moment(currentDate).add(1, 'days').toDate()] },
                            { $eq: ["$trangThaiMua", 3] }, // Trạng thái mua là 3
                            { $eq: ["$trangThaiThanhToan", 1] }, // Trạng thái thanh toán là đã thanh toán
                            { $eq: ["$trangThai", true] }
                        ]
                    }
                }
            }
        ]);

        // Bước 3: Lấy danh sách các món đặt tương ứng với các hóa đơn đã lọc và có cùng loại món
        const result = await MonDat.aggregate([
            {
                $match: { idHD: { $in: hoaDon.map(hd => hd._id) } }
            },
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
                $match: { "mon.idLM": loaiMon._id }
            },

        ]);

        // Bước 4: Tính toán số lượng và doanh thu của từng món
        const finalResult = result.reduce((accumulator, currentValue) => {
            const index = accumulator.findIndex(item => item._id.toString() === currentValue.idMon.toString());
            if (index === -1) {
                accumulator.push({
                    _id: currentValue.idMon,
                    tenMon: currentValue.mon.tenMon,
                    tenLoaiMon: tenLM,
                    soLuong: currentValue.soLuong,
                    doanhThu: currentValue.giaTienDat * currentValue.soLuong
                });
            } else {
                accumulator[index].soLuong += currentValue.soLuong;
                accumulator[index].doanhThu += currentValue.giaTienDat * currentValue.soLuong;
            }
            return accumulator;
        }, []);

        // Sắp xếp kết quả theo số lượng giảm dần
        finalResult.sort((a, b) => b.soLuong - a.soLuong);

        // Giới hạn số lượng kết quả trả về là 10
        const top10Result = finalResult.slice(0, 10);

        return {
            data: top10Result,
            success: true,
            message: "Thành công"
        };
    } catch (error) {
        console.error("Lỗi:", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi thực hiện thống kê."
        });
    }
};

const thongKeMonBanChay30NgayTheoTenLoaiMon = async (req, res) => {
    try {
        const tenLM = req.query.tenLM;
        const currentDate = moment().utc().startOf('day').toDate();

        // Lấy ngày 10 ngày trước
        const startDate = moment(currentDate).subtract(30, 'days').startOf('day').toDate();

        // Bước 1: Lấy ID của loại món dựa trên tên loại món
        const loaiMon = await LoaiMon.findOne({ tenLM: tenLM });
        if (!loaiMon) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy loại món có tên này."
            });
        }

        // Bước 2: Lấy danh sách các hóa đơn phù hợp với điều kiện
        const hoaDon = await HoaDon.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTaoString", startDate] }, // Hóa đơn được tạo trong ngày hôm nay
                            { $lte: ["$thoiGianTaoString", moment(currentDate).add(1, 'days').toDate()] },
                            { $eq: ["$trangThaiMua", 3] }, // Trạng thái mua là 3
                            { $eq: ["$trangThaiThanhToan", 1] }, // Trạng thái thanh toán là đã thanh toán
                            { $eq: ["$trangThai", true] }
                        ]
                    }
                }
            }
        ]);

        // Bước 3: Lấy danh sách các món đặt tương ứng với các hóa đơn đã lọc và có cùng loại món
        const result = await MonDat.aggregate([
            {
                $match: { idHD: { $in: hoaDon.map(hd => hd._id) } }
            },
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
                $match: { "mon.idLM": loaiMon._id }
            },

        ]);

        // Bước 4: Tính toán số lượng và doanh thu của từng món
        const finalResult = result.reduce((accumulator, currentValue) => {
            const index = accumulator.findIndex(item => item._id.toString() === currentValue.idMon.toString());
            if (index === -1) {
                accumulator.push({
                    _id: currentValue.idMon,
                    tenMon: currentValue.mon.tenMon,
                    tenLoaiMon: tenLM,
                    soLuong: currentValue.soLuong,
                    doanhThu: currentValue.giaTienDat * currentValue.soLuong
                });
            } else {
                accumulator[index].soLuong += currentValue.soLuong;
                accumulator[index].doanhThu += currentValue.giaTienDat * currentValue.soLuong;
            }
            return accumulator;
        }, []);

        // Sắp xếp kết quả theo số lượng giảm dần
        finalResult.sort((a, b) => b.soLuong - a.soLuong);

        // Giới hạn số lượng kết quả trả về là 10
        const top10Result = finalResult.slice(0, 10);

        return {
            data: top10Result,
            success: true,
            message: "Thành công"
        };
    } catch (error) {
        console.error("Lỗi:", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi thực hiện thống kê."
        });
    }
};



module.exports = {
    //thống kê doanh thu
    thongKeDoanhThuTheoNgay,
    thongKeDoanhThuTheo10Ngay,
    thongKeDoanhThuTheo30Ngay,
    thongKeDoanhThuTheoNam,
    thongKeDoanhThuTheoThangTrongNam,

    // thống kê món bán chạy tất cả
    thongKeMonBanChay1Ngay,
    thongKeMonBanChay10Ngay,
    thongKeMonBanChay30Ngay,

    //thống kê món bán chạy theo tên loại món
    thongKeMonBanChay1NgayTheoTenLoaiMon,
    thongKeMonBanChay10NgayTheoTenLoaiMon,
    thongKeMonBanChay30NgayTheoTenLoaiMon,

}