const { model: DanhGia } = require("../../model/DanhGia");
const mongo = require('mongoose');


const ThemDanhGia = async function (req, res) {
    try {
        const idKH = new mongo.Types.ObjectId(req.params.idKH);
        const idMon = new mongo.Types.ObjectId(req.params.idMon);
        const danhGia = req.body.danhGia;
        const daDanhGia = await DanhGia.findOne({ idKH: idKH, idMon: idMon })
        if (daDanhGia) {
            if (daDanhGia.trangThai === true) {
                await DanhGia.updateOne({ idKH, idMon }, { danhGia: danhGia, thoiGianTao: Date.now() });
                const index = await DanhGia.findOne({ idKH: idKH, idMon: idMon });
                res.json({
                    index,
                    msg: 'Thêm đánh giá lại thành công',
                    success: true
                });
            } else if (daDanhGia.trangThai === false) {
                return res.json({
                    error: 'Bạn bị khóa đánh giá món hiện tại',
                    msg: 'Bạn bị khóa đánh giá món hiện tại',
                    success: false
                });
            }
        } else {
            if (danhGia == "") {
                res.json({
                    error: 'Thêm đánh giá lỗi do thiếu đánh giá',
                    msg: 'Thêm đánh giá lỗi do thiếu đánh giá',
                    success: false
                });
            } else {
                const index = await DanhGia.create({
                    idKH: idKH,
                    idMon: idMon,
                    danhGia: danhGia,
                    trangThai: true
                })
                res.json({
                    index,
                    msg: 'Thêm đánh giá thành công',
                    success: true
                });
            }
        }

    } catch (error) {
        res.json({
            error: 'Lỗi khi thêm đánh giá',
            msg: 'Lỗi khi thêm đánh giá',
            success: false
        });
    }
}

const SuaDanhGia = async function (req, res) {
    try {
        const idDG = new mongo.Types.ObjectId(req.params.idDG);
        const danhGia = req.body.danhGia;
        const filter = { _id: idDG }
        const update = { danhGia: danhGia }
        const index = await DanhGia.findOneAndUpdate(filter, update, { new: true })

        if (!index) {
            return res.json({
                error: 'Không tìm thấy đánh giá để sửa',
                msg: 'Không tìm thấy đánh giá để sửa',
                success: false
            });
        } else if (danhGia == '') {
            return res.json({
                error: 'Sửa đánh giá lỗi do thiếu đánh giá',
                msg: 'Sửa đánh giá lỗi do thiếu đánh giá',
                success: false
            });
        } else {
            res.json({
                index,
                msg: 'Sửa đánh giá thành công',
                success: true
            });
        }
    } catch (error) {
        res.json({
            error: 'Lỗi khi sửa đánh giá',
            msg: 'Lỗi khi sửa đánh giá',
            success: false
        });
    }

}


const XoaDanhGia = async function (req, res) {
    try {
        const idDG = new mongo.Types.ObjectId(req.params.idDG);
        const filter = { _id: idDG }
        const update = { trangThai: false }
        const index = await DanhGia.findOneAndUpdate(filter, update, { new: true })

        if (!index) {
            return res.json({
                error: 'Không tìm thấy đánh giá để xóa',
                msg: 'Không tìm thấy đánh giá để xóa',
                success: false
            });
        } else {
            res.json({
                index,
                msg: 'Xóa đánh giá thành công',
                success: true
            });
        }
    } catch (error) {
        res.json({
            error: 'Lỗi khi xóa đánh giá',
            msg: 'Lỗi khi xóa đánh giá',
            success: false
        });
    }

}

const GetDanhSachTheoTenMon = async function (req, res) {
    try {
        const idMon = new mongo.Types.ObjectId(req.params.idMon);
        const trang = parseInt(req.query.trang) || 1;
        const timkiem = {};
        if (typeof (req.query.danhGia) !== 'undefined' && req.query.danhGia !== "" && req.query.danhGia !== "-1") {
            timkiem.danhGia = parseInt(req.query.danhGia);
        }
        if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(typeof (req.query.trangThai))) {
            const trangThaiValue = typeof (req.query.trangThai);
            if (trangThaiValue === true || trangThaiValue === false) {
                timkiem.trangThai = trangThaiValue === true;
            }
        }
        const list = await DanhGia.aggregate([
            {
                $match: {
                    idMon: idMon,
                }
            },
            {
                $lookup: {
                    from: "Mon",
                    localField: "idMon",
                    foreignField: "_id",
                    as: "KetQuaMon"
                }
            },
            {
                $unwind: {
                    path: "$KetQuaMon",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $lookup: {
                    from: "KhachHang",
                    localField: "idKH",
                    foreignField: "_id",
                    as: "KhachHangInfo"
                }
            },
            {
                $unwind: {
                    path: "$KhachHangInfo",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $project: {
                    "danhGia": "$danhGia",
                    "trangThai": "$trangThai",
                    "thoiGianTao": { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: { $add: ["$thoiGianTao", 7 * 60 * 60 * 1000] } } },
                    "tenMon": "$KetQuaMon.tenMon",
                    "tenKH": "$KhachHangInfo.tenKH",
                    "hinhAnh": { $concat: [req.protocol, "://", req.get("host"), "/public/images/", "$KhachHangInfo.hinhAnh"] }
                }
            },
            {
                $match:
                    timkiem,
            },
            {
                $limit: 10,
            },
            {
                $count: "count",
            }
        ]);

        return ({
            count: list[0].count,
            msg: 'Get đánh giá theo tên món thành công',
            success: true
        });
    } catch (error) {
        return ({
            error: 'Lỗi khi lấy đánh giá theo tên món',
            msg: 'Lỗi khi lấy đánh giá theo tên món',
            success: false
        });
    }
}

const GetDanhSachTheoTenKhachHang = async function (req, res) {
    try {
        const idKH = new mongo.Types.ObjectId(req.params.idKH);
        const trang = parseInt(req.query.trang) || 1;
        const itemsPerPage = 10; // Giới hạn số lượng đánh giá trên mỗi trang
        // Đếm tổng số đánh giá cho khách hàng cụ thể
        const totalCount = await DanhGia.countDocuments({ idKH });

        // Tính toán số lượng trang dựa trên tổng số đánh giá và số lượng mỗi trang
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        // Số vị trí bắt đầu của bản ghi trong trang hiện tại
        const startIndex = (trang - 1) * itemsPerPage;

        // Lấy danh sách đánh giá cho trang hiện tại
        const list = await DanhGia.aggregate([
            {
                $match: {
                    idKH: idKH
                }
            },
            {
                $lookup: {
                    from: "KhachHang",
                    localField: "idKH",
                    foreignField: "_id",
                    as: "KetQuaKhachHang"
                }
            },
            {
                $unwind: {
                    path: "$KetQuaKhachHang",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $project: {
                    "danhGia": "$danhGia",
                    "tenKH": "$KetQuaKhachHang.tenKH",
                }
            },
            {
                $skip: startIndex,
            },
            {
                $limit: itemsPerPage,
            },
        ]);

        const currentItemCount = list.length;
        res.json({
            list,
            trang,
            currentItemCount,
            totalPages,
            totalCount,
            msg: 'Lấy đánh giá theo tên khách hàng thành công',
            success: true
        });
    } catch (error) {
        res.json({
            error: 'Lỗi khi lấy đánh giá theo tên khách hàng',
            msg: 'Lỗi khi lấy đánh giá theo tên khách hàng',
            success: false
        });
    }
}


const GetDanhGiaTheoId = async function (req, res) {
    try {
        const idDanhGia = new mongo.Types.ObjectId(req.params.idDanhGia);
        const index = await DanhGia.findOne({ _id: idDanhGia });
        res.json({
            index,
            msg: 'Get đánh giá theo id thành công',
            success: true
        });
    } catch (error) {
        res.json({
            error: 'Lỗi khi lấy đánh giá theo id',
            msg: 'Lỗi khi lấy đánh giá theo id',
            success: false
        });
    }

}
const GetTrungBinhDanhGiaTheoMon = async function (req, res) {

    try {
        const idMon = new mongo.Types.ObjectId(req.params.idMon);
        const query = await DanhGia.aggregate([
            {
                $match: {
                    idMon: idMon
                }
            },
            {
                $lookup: {
                    from: "Mon",
                    localField: "idMon",
                    foreignField: "_id",
                    as: "KetQuaMon"
                }
            },
            {
                $unwind: {
                    path: "$KetQuaMon",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $group: {
                    _id: "$tenMon",
                    avgDanhGia: { $avg: "$danhGia" } // Tính trung bình đánh giá
                }
            }
        ]);


        return ({
            index: parseFloat(query[0].avgDanhGia.toFixed(1)),
            msg: 'Get số lượng đánh giá theo tên món thành công',
            success: true
        });
    } catch (error) {
        return ({
            error: 'Lỗi khi lấy số lượng đánh giá theo tên món',
            msg: 'Lỗi khi lấy số lượng đánh giá theo tên món',
            success: false
        });
    }
}

const getTrungBinhDanhGiaApi = async (req, res) => {
    const result = await GetTrungBinhDanhGiaTheoMon(req, res);
    res.json(result)
}
const getTatCaDanhGiaTheoMonApi = async (req, res) => {
    const result = await GetDanhSachTheoTenMon(req, res);
    res.json(result)
}

const GetDanhSachDanhGiaTheoMonVoiFilter = async function (req, res) {
    try {
        const idMon = new mongo.Types.ObjectId(req.params.idMon);
        const trang = parseInt(req.query.trang) || 1;
        const timkiem = {};
        if (typeof (req.query.danhGia) !== 'undefined' && req.query.danhGia !== "" && req.query.danhGia !== "-1") {
            timkiem.danhGia = parseInt(req.query.danhGia);
        }
        if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
            const trangThaiValue = parseInt(req.query.trangThai);
            if (trangThaiValue === 1 || trangThaiValue === 0) {
                timkiem.trangThai = trangThaiValue === 1;
            }
        }
        const query = await DanhGia.aggregate([
            {
                $match: {
                    idMon: idMon,
                }
            },
            {
                $lookup: {
                    from: "Mon",
                    localField: "idMon",
                    foreignField: "_id",
                    as: "KetQuaMon"
                }
            },
            {
                $unwind: {
                    path: "$KetQuaMon",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $lookup: {
                    from: "KhachHang",
                    localField: "idKH",
                    foreignField: "_id",
                    as: "KhachHangInfo"
                }
            },
            {
                $unwind: {
                    path: "$KhachHangInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "idDG": "$_id",
                    "danhGia": "$danhGia",
                    "trangThai": "$trangThai",
                    "thoiGianTao": { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: { $add: ["$thoiGianTao", 7 * 60 * 60 * 1000] } } },
                    "tenMon": "$KetQuaMon.tenMon",
                    "tenKH": "$KhachHangInfo.tenKH",
                    "hinhAnh": { $concat: [req.protocol, "://", req.get("host"), "/public/images/", "$KhachHangInfo.hinhAnh"] }
                }
            },
            {
                $match:
                    timkiem,
            },
            {
                $sort: { thoiGianTao: -1 }
            },
            {
                $skip: (trang - 1) * 10,
            },
            {
                $limit: 10,
            },
        ]);
        const count = await GetDanhSachTheoTenMon(req, res);
        const sl = await DanhGia.countDocuments({ idMon });
        const soDanhGiaTrenTrang = 10;
        const totalPages = Math.ceil(count.count / soDanhGiaTrenTrang);
        return ({
            list: query,
            count: count.count,
            soLuong: sl,
            totalPages: totalPages,
            currentPage: trang,
            msg: 'Get số lượng đánh giá theo tên món thành công',
            success: true
        });
    } catch (error) {
        return ({
            error: 'Lỗi khi lấy số lượng đánh giá theo tên món',
            msg: 'Lỗi khi lấy số lượng đánh giá theo tên món',
            success: false
        });
    }
}

const GetDanhSachDanhGiaTheoMonVoiFilterApi = async (req, res) => {
    const result = await GetDanhSachDanhGiaTheoMonVoiFilter(req, res);
    res.json(result)
}

const GetSoLuongDanhGiaTheoKhachHang = async function (req, res) {
    try {
        const idKH = new mongo.Types.ObjectId(req.params.idKH);
        const query = await DanhGia.aggregate([
            {
                $match: {
                    idKH: idKH
                }
            },
            {
                $lookup: {
                    from: "KhachHang",
                    localField: "idKH",
                    foreignField: "_id",
                    as: "KetQuaKhachHang"
                }
            },
            {
                $unwind: {
                    path: "$KetQuaKhachHang",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $project: {
                    "danhGia": "$danhGia",
                    "tenKH": "$KetQuaKhachHang.tenKH",
                }
            }
        ])

        res.json({
            count: query.length,
            msg: 'Get số lượng đánh giá theo tên khách hàng thành công',
            success: true
        });
    } catch (error) {
        res.json({
            error: 'Lỗi khi lấy số lượng đánh giá theo tên khách hàng',
            msg: 'Lỗi khi lấy số lượng đánh giá theo tên khách hàng',
            success: false
        });
    }
}

module.exports = {
    ThemDanhGia,
    SuaDanhGia,
    XoaDanhGia,
    GetDanhSachTheoTenMon,
    GetDanhSachTheoTenKhachHang,
    GetDanhGiaTheoId,
    GetTrungBinhDanhGiaTheoMon,
    GetSoLuongDanhGiaTheoKhachHang,
    getTatCaDanhGiaTheoMonApi,
    GetDanhSachDanhGiaTheoMonVoiFilter,
    GetDanhSachDanhGiaTheoMonVoiFilterApi,
    getTrungBinhDanhGiaApi
}