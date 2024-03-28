const { model: KhuyenMai } = require("../../model/KhuyenMai");
const mongo = require('mongoose');
const { parse, startOfDay, endOfDay } = require('date-fns');

// Hàm này để lấy ra 6 kí tự ngẫu nhiên có cả chữ cái viết hoa và số 
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}

//   Hàm này để thêm khuyến mãi 
const ThemKhuyenMai = async function (req, res) {
    const tieuDe = req.body.tieuDe;
    const maKhuyenMai = generateRandomString(6);
    const ngayBatDau = new Date(req.body.ngayBatDau);
    const ngayHetHan = new Date(req.body.ngayHetHan);
    const phanTramKhuyenMai = req.body.phanTramKhuyenMai;
    const donToiThieu = req.body.donToiThieu;

    try {
        const khuyenMaiDaCo = await KhuyenMai.findOne({ maKhuyenMai: maKhuyenMai })
        if (khuyenMaiDaCo) {
            if (khuyenMaiDaCo.trangThai === false) {
                await KhuyenMai.updateOne({ maKhuyenMai }, { trangThai: true });
                const index = await KhuyenMai.findOne({ maKhuyenMai: maKhuyenMai });
                res.status(200).json({
                    index,
                    message: 'Thêm khuyến mãi lại thành công',
                    success: true
                });
            } else if (khuyenMaiDaCo.trangThai != false) {
                res.status(200).json({
                    error: 'Khuyễn mãi đã tồn tại',
                    success: false
                });
            }
        } else if (tieuDe == "" || maKhuyenMai == "" || ngayBatDau == "" || ngayHetHan == "" || phanTramKhuyenMai == "" || donToiThieu == "") {
            res.status(200).json({
                error: 'Thêm khuyễn mãi lỗi do thiếu thông tin',
                success: false
            });
        } else {
            const index = await KhuyenMai.create({
                tieuDe: tieuDe,
                maKhuyenMai: maKhuyenMai,
                ngayBatDau: ngayBatDau,
                ngayHetHan: ngayHetHan,
                phanTramKhuyenMai: phanTramKhuyenMai,
                donToiThieu: donToiThieu,
                trangThai: true
            })
            res.status(200).json({
                index,
                message: 'Thêm khuyến mãi thành công',
                success: true
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi thêm khuyến mãi',
            success: false
        });
    }
}

// Hàm này để sửa khuyến mãi 
const SuaKhuyenMai = async function (req, res) {

    try {
        const idKM = new mongo.Types.ObjectId(req.params.idKM);
        const tieuDe = req.body.tieuDe;
        const maKhuyenMai = new Date(req.body.maKhuyenMai);
        const ngayBatDau = new Date(req.body.ngayBatDau);
        const ngayHetHan = req.body.ngayHetHan;
        const phanTramKhuyenMai = req.body.phanTramKhuyenMai;
        const donToiThieu = req.body.donToiThieu;

        const filter = { _id: idKM }
        const update = {
            tieuDe: tieuDe,
            maKhuyenMai: maKhuyenMai,
            ngayBatDau: ngayBatDau,
            ngayHetHan: ngayHetHan,
            phanTramKhuyenMai: phanTramKhuyenMai,
            donToiThieu: donToiThieu,

        }
        const index = await KhuyenMai.findOneAndUpdate(filter, update, { new: true })
        if (!index) {
            return res.status(404).json({
                error: 'Không tìm thấy khuyến mãi để sửa',
                success: false
            });
        } else if (tieuDe == "" || maKhuyenMai == "" || ngayBatDau == "" || ngayHetHan == "" || phanTramKhuyenMai == "" || donToiThieu == "") {
            return res.status(404).json({
                error: 'Sửa khuyến mãi lỗi do thiếu thông tin',
                success: false
            });
        } else {
            return {
                index,
                message: 'Sửa khuyến mãi thành công',
                success: true
            };
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi sửa khuyến mãi',
            success: false
        });
    }

}
const SuaKhuyenMaiApi = async (req, res) => {
    const result = await SuaKhuyenMai(req, res);
    res.json(result)
}

// Hàm này để xóa khuyến mãi (xóa mềm: chuyển trạng thái true thành false)
const XoaKhuyenMai = async function (req, res) {
    const idKM = new mongo.Types.ObjectId(req.params.idKM);

    try {
        const filter = { _id: idKM }
        // const update = { trangThai: false }
        const KM = await KhuyenMai.findOne(filter)
        if (KM.trangThai == true) {
            const update = { trangThai: false }
            const index = await KhuyenMai.findOneAndUpdate(filter, update, { new: true })
            if (!index) {
                return ({
                    error: 'Không tìm thấy khuyến mãi để xóa',
                    success: false
                });
            } else {
                return ({
                    index,
                    message: 'Xóa khuyến mãi thành công',
                    success: true
                });
            }
        } else {
            const update = { trangThai: true }
            const index = await KhuyenMai.findOneAndUpdate(filter, update, { new: true })
            if (!index) {
                return ({
                    error: 'Không tìm thấy khuyến mãi để xóa',
                    success: false
                });
            } else {
                return ({
                    index,
                    message: 'Xóa khuyến mãi thành công',
                    success: true
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi xóa khuyến mãi',
            success: false
        });
    }

}

const xoaKhuyenMaiApi = async (req, res) => {
    const result = await XoaKhuyenMai(req, res);
    res.json(result)
}

// hàm này để lấy ra tất cả khuyến mãi theo tiêu đề 
const GetKhuyenMaiTheoTieuDe = async function (req, res) {
    const trang = parseInt(req.query.trang) || 1;
    const tieuDe = req.query.tieuDe != "-1" ? "^" + req.query.tieuDe : "\\w+";
    try {
        var list = await KhuyenMai.find({
            tieuDe: { $regex: tieuDe },
            trangThai: true
        })
            .skip((trang - 1) * 10)
            .limit(10);

        if (list.length == 0) {
            res.status(200).json({
                message: 'không có khuyến mãi này',
                success: true
            });
        } else {
            res.status(200).json({
                list,
                count: list.length,
                message: 'Get khuyến mãi theo tiêu đề thành công',
                success: true
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi lấy khuyến mãi theo tiêu đề',
            success: false
        });
    }
}

// Hàm này để lấy ra khuyến mãi theo maKhuyenMai 
const GetKhuyenMaiTheoMaKhuyenMai = async function (req, res) {
    const trang = parseInt(req.query.trang) || 1;
    const maKhuyenMai = req.query.maKhuyenMai != "-1" ? "^" + req.query.maKhuyenMai : "\\w+";
    try {
        var list = await KhuyenMai.find({
            maKhuyenMai: { $regex: maKhuyenMai },
            trangThai: true
        })
            .skip((trang - 1) * 10)
            .limit(10);

        if (list.length == 0) {
            res.status(200).json({
                message: 'không có khuyến mãi này',
                success: false
            });
        } else {
            res.status(200).json({
                list,
                count: list.length,
                message: 'Get khuyến mãi theo tiêu đề thành công',
                success: true
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi lấy khuyến mãi theo tiêu đề',
            success: false
        });
    }
}

// Hàm này để lấy khuyến mãi theo phanTramKhuyenMai
const GetKhuyenMaiTheoPhanTram = async function (req, res) {
    const trang = parseInt(req.query.trang) || 1;
    let phanTramKhuyenMai = req.query.phanTramKhuyenMai != -1 ? req.query.phanTramKhuyenMai : Array.from({ length: 102 }, (_, index) => index - 1);
    try {
        var list = await KhuyenMai.find({
            phanTramKhuyenMai: { $in: phanTramKhuyenMai },
            trangThai: 1
        })
            .skip((trang - 1) * 10)
            .limit(10);

        if (list.length == 0) {
            res.status(200).json({
                message: 'không có khuyến mãi này',
                success: true
            });
        } else {
            res.status(200).json({
                list,
                count: list.length,
                message: 'Get khuyến mãi theo phần trăm thành công',
                success: true
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi lấy khuyến mãi theo phần trăm',
            success: false
        });
    }
}

// hàm này để lấy khuyến mãi theo đơn tối thiểu 
const GetKhuyenMaiTheoDonToiThieu = async function (req, res) {
    const trang = parseInt(req.query.trang) || 1;
    const MAX_DON_TOI_THIEU = 9999999;
    const donToiThieu = req.query.donToiThieu != -1 ? req.query.donToiThieu : Array.from({ length: MAX_DON_TOI_THIEU }, (_, index) => index - 1);
    try {
        var list = await KhuyenMai.find({
            donToiThieu: { $in: donToiThieu },
            trangThai: 1
        })
            .skip((trang - 1) * 10)
            .limit(10);

        if (list.length == 0) {
            res.status(200).json({
                message: 'không có khuyến mãi này',
                success: true
            });
        } else {
            res.status(200).json({
                list,
                count: list.length,
                message: 'Get khuyến mãi theo đơn tối thiểu thành công',
                success: true
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi lấy khuyến mãi theo đơn tối thiểu',
            success: false
        });
    }
}

// Hàm này để lấy khuyến mãi theo idKM 
const GetKhuyenMaiTheoId = async function (req, res) {
    const idKM = new mongo.Types.ObjectId(req.params.idKM);
    try {
        const index = await KhuyenMai.findOne({ _id: idKM });
        res.status(200).json({
            index,
            message: 'Get khuyến mãi theo id thành công',
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi lấy khuyến mãi theo id',
            success: false
        });
    }

}

// Hàm này để lấy khuyến mãi theo ngày 
const GetKhuyenMaiTheoNgay = async function (req, res) {
    const trang = parseInt(req.query.trang) || 1;
    const ngayCanTim = req.query.ngayCanTim;

    const startOfDayNgayCanTim = startOfDay(ngayCanTim);
    const endOfDayNgayCanTim = endOfDay(ngayCanTim);

    try {
        var list = await KhuyenMai.find({
            ngayBatDau: { $lte: startOfDayNgayCanTim },
            ngayHetHan: { $gte: endOfDayNgayCanTim },
            trangThai: 1
        })
            .skip((trang - 1) * 10)
            .limit(10);

        if (list.length === 0) {
            res.status(200).json({
                message: 'Không có khuyến mãi nào trong ngày này',
                success: false
            });
        } else {
            res.status(200).json({
                list,
                count: list.length,
                message: 'Get khuyến mãi theo ngày thành công',
                success: true
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi lấy khuyến mãi theo ngày',
            success: false
        });
    }
}


const getTatCaKhuyenMai = async (req, res) => {
    try {

        const trangThai = req.params.trangThai;
        const trang = parseInt(req.query.trang) || 1;
        const timkiem = {};
        if (typeof (req.query.tieuDe) !== 'undefined' && req.query.tieuDe !== "") {
            timkiem.tieuDe = { $regex: req.query.tieuDe, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
        }
        if (typeof (req.query.ngayBatDau) !== 'undefined' && req.query.ngayBatDau !== "") {
            const parts = req.query.ngayBatDau.split('/');
            const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            timkiem.ngayBatDau = { $gte: new Date(formattedDate) };
        }

        if (typeof (req.query.ngayHetHan) !== 'undefined' && req.query.ngayHetHan !== "") {
            const parts = req.query.ngayHetHan.split('/');
            const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            timkiem.ngayHetHan = { $lte: new Date(formattedDate) };
        }

        if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
            const trangThaiValue = parseInt(req.query.trangThai);
            if (trangThaiValue === 1 || trangThaiValue === 0) {
                timkiem.trangThai = trangThaiValue === 1;
            }
        }


        const list = await KhuyenMai.aggregate([
            {
                $match:
                    timkiem,
            },
            {
                $project: {
                    "tieuDe": "$tieuDe",
                    "maKhuyenMai": "$maKhuyenMai",
                    "ngayBatDau": "$ngayBatDau",
                    "ngayHetHan": "$ngayHetHan", // Thay vì "$tenCH"
                    "phanTramKhuyenMai": "$phanTramKhuyenMai",
                    "donToiThieu": "$donToiThieu",
                    "trangThai": "$trangThai",
                }
            },
            {
                $skip: (trang - 1) * 10,
            },
            {
                $limit: 10,
            },
        ])

        return {
            count: list.length,
            list: list,
            message: 'Get tat ca khuyen mai thanh cong',
            success: true,
        };

        // return {
        //     count:list.length,
        //     list:list,
        //     message: 'Get tat ca khuyen mai thanh cong',
        //     success: true,

        // };
    } catch (error) {
        console.error(error);
        return {
            error: 'Lỗi khi lấy số lượng đánh giá theo tên khách hàng',
            success: false
        };
    }
};

const getTatCaKhuyenMaiApi = async (req, res) => {
    const result = await getTatCaKhuyenMai(req, res);
    res.json(result)
}


module.exports = {
    ThemKhuyenMai,
    SuaKhuyenMai,
    XoaKhuyenMai,
    xoaKhuyenMaiApi,
    GetKhuyenMaiTheoTieuDe,
    GetKhuyenMaiTheoPhanTram,
    GetKhuyenMaiTheoDonToiThieu,
    GetKhuyenMaiTheoId,
    GetKhuyenMaiTheoNgay,
    GetKhuyenMaiTheoMaKhuyenMai,
    getTatCaKhuyenMai,
    getTatCaKhuyenMaiApi,
    SuaKhuyenMaiApi

}