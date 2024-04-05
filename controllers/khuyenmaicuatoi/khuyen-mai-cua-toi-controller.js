const { model: KhuyenMaiCuaToi } = require("../../model/KhuyenMaiCuaToi");
const { model: khuyenMai } = require("../../model/KhuyenMai");
const mongo = require("mongoose");
const ObjectId = mongo.Types.ObjectId;

const addKMCuaToi = async (req, res, next) => {

    try {
        const idKM = req.params.idKM;
        const idKH = req.body.idKH;
        const khuyenmai = await khuyenMai.findById(idKM);
        if (!khuyenmai) {
            throw new Error("Không tìm thấy khuyến mãi.");
        }
        if (!khuyenmai.trangThai) {
            throw new Error("khuyến mãi không ở trạng thái hoạt động.");
        }

        await KhuyenMaiCuaToi.create({
            idKM: idKM,
            idKH: idKH,
        })

        return {
            msg: "khuyến mãi được lấy về",
            success: true,
        }

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message || "Đã xảy ra lỗi khi thêm khuyến mãi " })

    }
}

const getAllKhuyenMaiCT = async (req, res, next) => {
    try {
        const page = parseInt(req.query.trang) || 1;
        const limit = 10; // Số lượng phần tử trên mỗi trang
        const timkiem = {};

        if (typeof (req.query.tieuDe) !== 'undefined' && req.query.tieuDe !== "") {
            timkiem.tieuDe = { $regex: req.query.tieuDe, $options: 'i' };
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

        const totalCount = await KhuyenMaiCuaToi.countDocuments(timkiem);
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = Math.min(page, totalPages);

        const result = await KhuyenMaiCuaToi.aggregate([
            {
                $match: timkiem,
            },
            {
                $lookup: {
                    from: "KhuyenMai",
                    localField: "idKM",
                    foreignField: "_id",
                    as: "km"
                }
            },
            {
                $addFields: {
                    trangThaiKM: { $cond: { if: { $isArray: "$km" }, then: true, else: false } }
                }
            },
            {
                $project: {
                    tieuDe: { $arrayElemAt: ["$km.tieuDe", 0] },
                    ngayBatDau: { $arrayElemAt: ["$km.ngayBatDau", 0] },
                    ngayHetHan: { $arrayElemAt: ["$km.ngayHetHan", 0] },
                    phanTramKhuyenMai: { $arrayElemAt: ["$km.phanTramKhuyenMai", 0] },
                    donToiThieu: { $arrayElemAt: ["$km.donToiThieu", 0] },
                    trangThaiKM: 1
                }
            },
            {
                $skip: (currentPage - 1) * limit, // Bỏ qua các bản ghi trước khi trang hiện tại
            },
            {
                $limit: limit, // Giới hạn số lượng bản ghi trên mỗi trang
            },
        ]);

        return {
            data: result,
            currentPage: currentPage,
            totalItems: totalCount,
            totalPages: totalPages,
            success: true,
            msg: "lấy danh sách thành công"
        };
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách Khuyến mãi", error });
    }
};



const deleteKhuyenMaiCT = async (req, res) => {
    try {
        await KhuyenMaiCuaToi.findByIdAndDelete(req.params.id);
        return {
            success: true,
            message: "Xóa Khuyến mãi thành công"
        };
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa Khuyến mãi", error
        });
    }
};

const addKMCuaToiApi = async (req, res, next) => {
    try {
        const result = await addKMCuaToi(req, res, next);
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
const getAllKhuyenMaiCTApi = async (req, res, next) => {
    try {
        const result = await getAllKhuyenMaiCT(req, res, next);
        console.log(result);
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
const deleteKhuyenMaiCTApi = async (req, res, next) => {
    try {
        const result = await deleteKhuyenMaiCT(req, res, next);
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




module.exports = {
    addKMCuaToiApi,
    deleteKhuyenMaiCTApi,
    getAllKhuyenMaiCTApi,
    //Api
};