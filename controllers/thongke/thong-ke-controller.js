const { model: HoaDon } = require("../../model/HoaDon");
const { model: MonDat } = require("../../model/MonDat");
const { model: LoaiMon } = require("../../model/LoaiMon");
const { model: Mon } = require("../../model/Mon");
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
                    thanhTien: { $sum: "$thanhTien" } // Tính tổng tiền
                }
            }
        ]);

        // Lấy kết quả cho ngày cụ thể
        const filteredResult = result.find(item => item._id === moment(currentDate).format("YYYY/MM/DD"));

        // Tính tổng tiền
        const thanhTien = filteredResult ? filteredResult.thanhTien : 0;

        return {
            tongTien: thanhTien,
            success: true,
            msg: "Thành công"
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            success: false,
            msg: 'Đã xảy ra lỗi khi thực hiện thống kê.'
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
                    thanhTien: { $sum: "$thanhTien" } // Tính tổng tiền
                }

            }
        ]);

        // Tính tổng tiền
        const thanhTien = result.length > 0 ? result[0].thanhTien : 0;

        return {
            tongTien: thanhTien,
            success: true,
            msg: "Thành công"
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            success: false,
            msg: 'Đã xảy ra lỗi khi thực hiện thống kê.'
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
                    thanhTien: { $sum: "$thanhTien" } // Tính tổng tiền
                }

            }
        ]);

        // Tính tổng tiền
        const thanhTien = result.length > 0 ? result[0].thanhTien : 0;

        return {
            tongTien: thanhTien,
            success: true,
            msg: "Thành công"
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            success: false,
            msg: 'Đã xảy ra lỗi khi thực hiện thống kê.'
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
                    thanhTien: { $sum: "$thanhTien" } // Tính tổng tiền của tất cả các hóa đơn
                }
            }

        ]);
        const thanhTien = result.length > 0 ? result[0].thanhTien : 0;

        // Trả về tổng tiền của các hóa đơn thỏa mãn điều kiện trong năm
        return {
            index: thanhTien,
            success: true,
            msg: "thành công"
        }
    } catch (error) {
        console.error("Error:", error);
        return {
            success: false,
            msg: 'Đã xảy ra lỗi khi thực hiện thống kê.'
        };
    }
};

const thongKeDoanhThuTheoThangTrongNam = async (req, res, next) => {
    try {
        // Nhận năm từ request params
        // Nhận năm từ request params
        let nam = req.query.nam;

        // Kiểm tra xem năm đã được cung cấp trong query hay chưa
        if (!nam) {
            // Nếu không, sử dụng năm hiện tại
            nam = new Date().getFullYear();
        }



        // Tạo mảng chứa tên của các tháng
        const monthNames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        // Khởi tạo mảng để lưu trữ doanh thu của từng tháng
        const monthlyRevenue = [];

        // Lặp qua từng tháng trong năm
        for (let month = 0; month < 12; month++) {
            // Tính ngày đầu tiên và cuối cùng của tháng
            const startDate = moment(`${nam}-${month + 1}-01`, 'YYYY-MM-DD').startOf('month').toDate();
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
                        thanhTien: { $sum: "$thanhTien" }
                    }
                }
            ]);

            // Lưu tổng doanh thu vào mảng monthlyRevenue
            const monthRevenueObj = { month: monthNames[month], tong: 0 };
            if (result.length > 0) {
                monthRevenueObj.tong = result[0].thanhTien;
            }
            monthlyRevenue.push(monthRevenueObj);
        }

        // Gửi kết quả dưới dạng mảng
        return {
            data: monthlyRevenue,
            success: true,
            msg: "Thành công"
        };
    } catch (error) {
        console.error("Error:", error);
        return ({
            success: false,
            msg: 'Đã xảy ra lỗi khi thực hiện thống kê.'
        });
    }
}
// Thông kê món bán chạy tất cả

// thống kê món bán chạy theo query tên loại món

const thongKeMonBanChayTheoTenLoaiMon = async (req, res) => {
    try {

        const tenLM = req.query.tenLM;
        const loaiMon = await LoaiMon.findOne({ tenLM: tenLM });
        if (!loaiMon) {
            return res.json({
                success: false,
                msg: "Không tìm thấy loại món có tên này."
            });
        }

        const nam = req.query.nam || new Date().getFullYear().toString();
        const thang = req.query.thang || (new Date().getMonth() + 1).toString();

        let startDate, endDate;
        if (!req.query.thang) {
            startDate = moment({ year: nam, month: 0, day: 1 }).startOf('year').toDate();
            endDate = moment({ year: nam, month: 11, day: 31 }).endOf('year').toDate();
        } else {
            startDate = moment({ year: nam, month: thang - 1, day: 1 }).startOf('month').toDate();
            endDate = moment({ year: nam, month: thang - 1, day: 1 }).endOf('month').toDate();
        }

        let matchConditions = [
            { $gte: ["$thoiGianTao", startDate] },
            { $lte: ["$thoiGianTao", endDate] },
            { $eq: ["$trangThaiMua", 3] },
            { $eq: ["$trangThaiThanhToan", 1] },
            { $eq: ["$trangThai", true] }
        ];

        const hoaDon = await HoaDon.aggregate([
            {
                $match: {
                    $expr: {
                        $and: matchConditions
                    }
                }
            }
        ]);

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
                $lookup: {
                    from: "LoaiMon",
                    localField: "mon.idLM",
                    foreignField: "_id",
                    as: "loaiMon"
                }
            },
            { $unwind: "$loaiMon" },
            { $match: { "loaiMon.tenLM": tenLM } }
        ]);

        let finalResult = result.reduce((accumulator, currentValue) => {
            const index = accumulator.findIndex(item => item._id.toString() === currentValue.idMon.toString());
            if (index === -1) {
                accumulator.push({
                    _id: currentValue.idMon,
                    tenMon: currentValue.mon.tenMon,
                    tenLM: currentValue.loaiMon.tenLM, // Sửa đổi tên loại món
                    soLuong: currentValue.soLuong,
                    doanhThu: currentValue.giaTienDat * currentValue.soLuong,
                    hinhAnh: `${req.protocol}://${req.get("host")}/public/images/${currentValue.mon.hinhAnh}`
                });
            } else {
                accumulator[index].soLuong += currentValue.soLuong;
                accumulator[index].doanhThu += currentValue.giaTienDat * currentValue.soLuong;
            }
            return accumulator;
        }, []);

        finalResult.sort((a, b) => b.doanhThu - a.doanhThu);

        const top10Result = finalResult.slice(0, 10);

        return {
            data: top10Result,
            success: true,
            msg: "Thành công"
        };
    } catch (error) {
        console.error("Lỗi:", error);
        return ({
            success: false,
            msg: "Đã xảy ra lỗi khi thực hiện thống kê."
        });
    }
};


const thongKeMonBanChayTheoNam = async (req, res) => {
    try {


        const nam = req.query.nam || new Date().getFullYear().toString();
        const thang = req.query.thang || (new Date().getMonth() + 1).toString();

        let startDate, endDate;
        if (!req.query.thang) {
            startDate = moment({ year: nam, month: 0, day: 1 }).startOf('year').toDate();
            endDate = moment({ year: nam, month: 11, day: 31 }).endOf('year').toDate();
        } else {
            startDate = moment({ year: nam, month: thang - 1, day: 1 }).startOf('month').toDate();
            endDate = moment({ year: nam, month: thang - 1, day: 1 }).endOf('month').toDate();
        }

        let matchConditions = [
            { $gte: ["$thoiGianTao", startDate] },
            { $lte: ["$thoiGianTao", endDate] },
            { $eq: ["$trangThaiMua", 3] },
            { $eq: ["$trangThaiThanhToan", 1] },
            { $eq: ["$trangThai", true] }
        ];

        const hoaDon = await HoaDon.aggregate([
            {
                $match: {
                    $expr: {
                        $and: matchConditions
                    }
                }
            }
        ]);

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
                $lookup: {
                    from: "LoaiMon",
                    localField: "mon.idLM",
                    foreignField: "_id",
                    as: "loaiMon"
                }
            },
            { $unwind: "$loaiMon" },
            // { $match: { "loaiMon.tenLM": tenLM } }
        ]);

        let finalResult = result.reduce((accumulator, currentValue) => {
            const index = accumulator.findIndex(item => item._id.toString() === currentValue.idMon.toString());
            if (index === -1) {
                accumulator.push({
                    _id: currentValue.idMon,
                    tenMon: currentValue.mon.tenMon,
                    tenLM: currentValue.loaiMon.tenLM, // Sửa đổi tên loại món
                    soLuong: currentValue.soLuong,
                    giaTien: currentValue.giaTienDat,
                    doanhThu: currentValue.giaTienDat * currentValue.soLuong,
                    hinhAnh: `${req.protocol}://${req.get("host")}/public/images/${currentValue.mon.hinhAnh}`
                });
            } else {
                accumulator[index].soLuong += currentValue.soLuong;
                accumulator[index].doanhThu += currentValue.giaTienDat * currentValue.soLuong;
            }
            return accumulator;
        }, []);

        finalResult.sort((a, b) => b.doanhThu - a.doanhThu);

        const top10Result = finalResult.slice(0, 10);

        return {
            data: top10Result,
            success: true,
            msg: "Thành công"
        };
    } catch (error) {
        console.error("Lỗi:", error);
        return ({
            success: false,
            msg: "Đã xảy ra lỗi khi thực hiện thống kê."
        });
    }
};



const thongKeDoanhThuTheoNgayToNgay = async (req, res) => {
    try {
        const { ngayBatDau, ngayKetThuc } = req.query;

        if (!ngayBatDau || !ngayKetThuc) {
            return ({
                success: false,
                msg: 'Vui lòng cung cấp đầy đủ ngày bắt đầu và ngày kết thúc.'
            });
        }

        // Chuyển đổi chuỗi ngày thành đối tượng Date
        const startDate = moment(ngayBatDau, "DD/MM/YYYY").startOf('day').toDate();
        const endDate = moment(ngayKetThuc, "DD/MM/YYYY").endOf('day').toDate();

        const result = await HoaDon.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$thoiGianTao", startDate] }, // Hóa đơn được tạo từ ngày bắt đầu
                            { $lt: ["$thoiGianTao", moment(endDate).add(1, 'days').toDate()] }, // Hóa đơn được tạo trước ngày kết thúc
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
                    thanhTien: { $sum: "$thanhTien" } // Tính tổng tiền
                }
            }
        ]);

        // Tính tổng tiền
        const thanhTien = result.length > 0 ? result[0].thanhTien : 0;

        return ({
            index: thanhTien,
            success: true,
            msg: "Thành công"
        });
    } catch (error) {
        console.error("Error:", error);
        return ({
            success: false,
            msg: 'Đã xảy ra lỗi khi thực hiện thống kê.'
        });
    }
};


const getListMon = async () => {
    try {
        const listMon = await Mon.find({ trangThai: true });
        return listMon;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách món:", error);
        throw new Error("Đã xảy ra lỗi khi lấy danh sách món");
    }
};

const thongKeMonBanChay = async (req, res) => {
    try {
        const nam = req.query.nam || new Date().getFullYear().toString();
        const thang = req.query.thang || (new Date().getMonth() + 1).toString();
        const trang = parseInt(req.query.trang) || 1;
        const limit = parseInt(req.query.limit) || 10;

        let startDate, endDate;
        if (!req.query.thang) {
            startDate = moment({ year: nam, month: 0, day: 1 }).startOf('year').toDate();
            endDate = moment({ year: nam, month: 11, day: 31 }).endOf('year').toDate();
        } else {
            startDate = moment({ year: nam, month: thang - 1, day: 1 }).startOf('month').toDate();
            endDate = moment({ year: nam, month: thang - 1, day: 1 }).endOf('month').toDate();
        }

        const hoaDon = await HoaDon.aggregate([
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
            }
        ]);

        const listMonDatHD = await MonDat.aggregate([
            {
                $match: { idHD: { $in: hoaDon.map(hd => hd._id) } }
            },
            {
                $group: {
                    _id: "$idMon",
                    soLuong: { $sum: "$soLuong" },
                    doanhThu: { $sum: { $multiply: ["$giaTienDat", "$soLuong"] } }
                }
            }
        ]);

        const listMon = await getListMon();

        const finalResult = listMon.map(mon => {
            const monDatInfo = listMonDatHD.find(item => item._id.toString() === mon._id.toString());
            if (monDatInfo) {
                return {
                    _id: mon._id,
                    tenMon: mon.tenMon,
                    tenLM: mon.tenLM,
                    soLuong: monDatInfo.soLuong,
                    giaTien: mon.giaTien,
                    doanhThu: monDatInfo.doanhThu,
                    hinhAnh: `${req.protocol}://${req.get("host")}/public/images/${mon.hinhAnh}`
                };
            } else {
                return {
                    _id: mon._id,
                    tenMon: mon.tenMon,
                    tenLM: mon.tenLM,
                    soLuong: 0,
                    giaTien: mon.giaTien,
                    doanhThu: 0,
                    hinhAnh: `${req.protocol}://${req.get("host")}/public/images/${mon.hinhAnh}`
                };
            }
        });

        finalResult.sort((a, b) => b.doanhThu - a.doanhThu);
        const totalItems = finalResult.length;
        const totalPages = Math.ceil(finalResult.length / limit);
        const startIndex = (trang - 1) * limit;
        const endIndex = trang * limit;
        const paginatedResult = finalResult.slice(startIndex, endIndex);

        return {
            list: paginatedResult,
            totalItems: totalItems,
            totalPages: totalPages,
            currentPage: trang,
            itemsPerPage: paginatedResult.length,
            success: true,
            msg: "Thành công"
        };
    } catch (error) {
        console.error("Lỗi:", error);
        return {
            success: false,
            msg: "Đã xảy ra lỗi khi thực hiện thống kê."
        };
    }
}





module.exports = {
    //thống kê doanh thu
    thongKeDoanhThuTheoNgay,
    thongKeDoanhThuTheo10Ngay,
    thongKeDoanhThuTheo30Ngay,
    thongKeDoanhThuTheoNam,
    thongKeDoanhThuTheoThangTrongNam,

    //thống kê món bán chạy theo tên loại món
    thongKeMonBanChayTheoTenLoaiMon,
    thongKeMonBanChayTheoNam,
    thongKeDoanhThuTheoNgayToNgay,
    thongKeMonBanChay


}