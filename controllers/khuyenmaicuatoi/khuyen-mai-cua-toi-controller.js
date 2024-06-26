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
            return res.json({ msg: "Không tìm thấy khuyến mãi.", success: false });
        }
        if (!khuyenmai.trangThai) {
            return res.json({ msg: "khuyến mãi không ở trạng thái hoạt động.", success: false });
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
        return ({ error: e.message, msg: "Đã xảy ra lỗi khi thêm khuyến mãi ", success: false });

    }
}

const getAllKhuyenMaiCT = async (req, res, next) => {
    try {
        const idKH = new mongo.Types.ObjectId(req.params.idKH);
        const page = parseInt(req.query.trang) || 1;
        const limit = 10; // Số lượng phần tử trên mỗi trang
        const timkiem = { idKH: idKH, trangThai: true };


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
                    idKM: { $arrayElemAt: ["$km._id", 0] },
                    tieuDe: { $arrayElemAt: ["$km.tieuDe", 0] },
                    ngayBatDau: { $arrayElemAt: ["$km.ngayBatDau", 0] },
                    ngayHetHan: { $arrayElemAt: ["$km.ngayHetHan", 0] },
                    phanTramKhuyenMai: { $arrayElemAt: ["$km.phanTramKhuyenMai", 0] },
                    donToiThieu: { $arrayElemAt: ["$km.donToiThieu", 0] },
                    trangThaiKM: 1,
                    maKhuyenMai: { $arrayElemAt: ["$km.maKhuyenMai", 0] },
                    trangThai: "$trangThai"
                }
            },
            {
                $skip: (currentPage - 1) * limit, // Bỏ qua các bản ghi trước khi trang hiện tại
            },
            {
                $limit: limit, // Giới hạn số lượng bản ghi trên mỗi trang
            },
        ]);
        const formattedResult = result.map(item => ({
            ...item,
            ngayBatDau: item.ngayBatDau.toISOString().split('T')[0],
            ngayHetHan: item.ngayHetHan.toISOString().split('T')[0]
        }));

        return {
            list: formattedResult,
            currentPage: currentPage,
            totalItems: totalCount,
            totalPages: totalPages,
            success: true,
            msg: "lấy danh sách thành công"
        };
    } catch (error) {
        return ({ msg: "Lỗi khi lấy danh sách Khuyến mãi", success: false });
    }
};



const deleteKhuyenMaiCT = async (req, res) => {
    try {
        const { id, idKH } = req.params;

        // Kiểm tra xem idKMCT và idKH có tồn tại và hợp lệ không
        const khuyenMaiCuaToi = await KhuyenMaiCuaToi.findOne({ _id: id, idKH: idKH });

        if (!khuyenMaiCuaToi) {
            return {
                success: false,
                msg: "Không tìm thấy Khuyến mãi hoặc Khách hàng"
            };
        }

        // Nếu tồn tại, thực hiện xóa
        await KhuyenMaiCuaToi.findByIdAndDelete(id);

        return {
            success: true,
            msg: "Xóa Khuyến mãi thành công"
        };
    } catch (error) {
        return {
            success: false,
            error,
            msg: "Lỗi khi xóa Khuyến mãi"
        };
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
            res.json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
        } else {
            console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        }
    }
}
const getAllKhuyenMaiCTApi = async (req, res, next) => {
    try {
        const result = await getAllKhuyenMaiCT(req, res, next);
        if (!res.headersSent) {
            // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi
            res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
        } else {
            console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi kết quả.");
        };
    } catch (error) {
        // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi lỗi
        if (!res.headersSent) {
            res.json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
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
            res.json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
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