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

const getAllKhuyenMaiCT = async (req, res) => {
    try {
        const result = await KhuyenMaiCuaToi.aggregate([
            {
                $lookup: {
                    from: "KhuyenMai",
                    localField: "idKM",
                    foreignField: "_id",
                    as: "km"
                }
            },
            {
                $unwind: "$km"
            },
            {
                $project: {
                    _id: 1,
                    idKM: 1,
                    tieuDe: "$km.tieuDe",
                    ngayBatDau: "$km.ngayBatDau",
                    ngayHetHan: "$km.ngayHetHan",
                    phanTramKhuyenMai: "$km.phanTramKhuyenMai",
                    donToiThieu: "$km.donToiThieu",
                }
            }
        ]);

        return {
            data: result,
            success: true,
            msg: "thành công"
        }
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