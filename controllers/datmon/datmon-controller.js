const { model: MonDat } = require("../../model/MonDat");
const { model: HoaDon } = require("../../model/HoaDon");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


// Thêm mới món đặt
const addMonDat = async (req, res, next) => {
    try {
        const idHD = req.params.idHD; // Lấy id hóa đơn từ params

        if (!req.body.idMon || !req.body.giaTienDat || !req.body.soLuong) {
            throw new Error("Thông tin món đặt không đầy đủ hoặc không hợp lệ.");
        }
        let foundMonDat = await MonDat.findOne({ idMon: req.body.idMon });
        if (foundMonDat) {
            return res.status(400).json({ msg: "Món đặt đã tồn tại" });
        }

        // Kiểm tra hóa đơn
        const hoaDon = await HoaDon.findById(idHD);
        if (!hoaDon) {
            throw new Error("Không tìm thấy hóa đơn.");
        }

        // Kiểm tra trạng thái của hóa đơn
        if (!hoaDon.trangThai) {
            throw new Error("Hóa đơn không ở trạng thái hoạt động.");
        }
        // kiểm tra trạng thái mua của hóa đơn
        if (hoaDon.trangThaiMua !== 0) {
            throw new Error("Hóa đơn không ở trạng thái Đợi duyệt.");
        }

        const tongTienMoi = hoaDon.tongTien + (req.body.giaTienDat * req.body.soLuong);


        await HoaDon.findByIdAndUpdate(idHD, { tongTien: tongTienMoi }, { new: true });

        // await updateTongTienHoaDon(idHD);
        // Tạo món đặt mới với id hóa đơn đã được cung cấp
        await MonDat.create({
            idHD: idHD,
            idMon: req.body.idMon,
            giaTienDat: req.body.giaTienDat,
            soLuong: req.body.soLuong
        })

        // Trả về kết quả thành công
        return {
            msg: "Món đặt đã được thêm thành công",
        };
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message || "Đã xảy ra lỗi khi thêm món đặt" });
    }
}

const updateMonDat = async (req, res, next) => {
    try {
        const id = req.params.id; // Lấy id của món đặt từ params

        if (!req.body.soLuong) {
            throw new Error("Thông tin món đặt không đầy đủ hoặc không hợp lệ.");
        }

        // Lấy thông tin món đặt từ cơ sở dữ liệu
        const monDat = await MonDat.findById(id);
        if (!monDat) {
            throw new Error("Không tìm thấy món đặt.");
        }

        // Kiểm tra hóa đơn liên kết với món đặt
        const hoaDon = await HoaDon.findById(monDat.idHD);
        if (!hoaDon) {
            throw new Error("Không tìm thấy hóa đơn liên kết với món đặt.");
        }

        // Kiểm tra trạng thái mua của hóa đơn
        if (hoaDon.trangThaiMua !== 0) {
            throw new Error("Hóa đơn không ở trạng thái mua.");
        }

        // Tính tổng tiền mới
        let tongTienMoi = hoaDon.tongTien;
        if (req.body.soLuong < monDat.soLuong) {
            // Nếu số lượng mới nhỏ hơn số lượng ban đầu, giảm tổng tiền đi
            tongTienMoi -= (monDat.giaTienDat * (monDat.soLuong - req.body.soLuong));
        } else if (req.body.soLuong > monDat.soLuong) {
            // Nếu số lượng mới lớn hơn số lượng ban đầu, tăng tổng tiền lên
            tongTienMoi += (monDat.giaTienDat * (req.body.soLuong - monDat.soLuong));
        }

        // Cập nhật thông tin món đặt
        await MonDat.findByIdAndUpdate(id, {
            soLuong: req.body.soLuong
        });

        // Cập nhật tổng tiền của hóa đơn
        await HoaDon.findByIdAndUpdate(hoaDon._id, { tongTien: tongTienMoi }, { new: true });

        // Trả về kết quả thành công
        return {
            msg: "Món đặt đã được cập nhật thành công",
        };
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message || "Đã xảy ra lỗi khi cập nhật món đặt" });
    }
}

const deleteMonDat = async (req, res, next) => {
    try {
        const id = req.params.id; // Lấy id của món đặt từ params

        // Lấy thông tin món đặt từ cơ sở dữ liệu
        const monDat = await MonDat.findById(id);
        if (!monDat) {
            throw new Error("Không tìm thấy món đặt.");
        }

        // Kiểm tra hóa đơn liên kết với món đặt
        const hoaDon = await HoaDon.findById(monDat.idHD);
        if (!hoaDon) {
            throw new Error("Không tìm thấy hóa đơn liên kết với món đặt.");
        }

        // Kiểm tra trạng thái mua của hóa đơn
        if (hoaDon.trangThaiMua !== 0) {
            throw new Error("Hóa đơn không ở trạng thái mua.");
        }

        // Tính toán tổng tiền mới
        const tongTienMoi = hoaDon.tongTien - (monDat.giaTienDat * monDat.soLuong);

        // Xóa món đặt từ cơ sở dữ liệu
        await MonDat.findByIdAndDelete(id);

        // Cập nhật tổng tiền của hóa đơn
        await HoaDon.findByIdAndUpdate(hoaDon._id, { tongTien: tongTienMoi }, { new: true });

        // Trả về kết quả thành công
        return {
            msg: "Món đặt đã được xóa thành công",
        };
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message || "Đã xảy ra lỗi khi xóa món đặt" });
    }
}

const deleteMonDatMem = async (req, res, next) => {
    try {
        const id = req.params.id;

        const trangThai = await MonDat.findOneAndUpdate(
            { _id: id },
            { $set: { trangThai: false } },
            { new: true },
        );
        if (!trangThai) {
            return res.status(404).json({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: trangThai,
        };
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi update " });
    }
}

const getDanhSachMonDatByIdHoaDon = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ msg: 'Vui lòng cung cấp ID hóa đơn' });
        }

        // Lấy danh sách hóa đơn của khách hàng dựa trên ID
        const danhSachMonDat = await MonDat.find({ idHD: id });

        // Trả về danh sách hóa đơn
        return { data: danhSachMonDat };
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn của món đặt', error: error.message });
    }
};

// // Cập nhật món đặt
// const checkTrangThaiMua = async (hoaDonId) => {
//     try {
//         // Tìm hóa đơn dựa trên id
//         const hoaDon = await HoaDon.findById(hoaDonId);

//         // Kiểm tra xem hóa đơn có tồn tại không
//         if (!hoaDon) {
//             return { canUpdate: false, message: "Không tìm thấy hóa đơn" };
//         }

//         // Kiểm tra xem trạng thái mua của hóa đơn có phải là 1 không
//         if (hoaDon.trangThaiMua === 1) {
//             return { canUpdate: true, message: "Trạng thái mua của hóa đơn là 1" };
//         } else {
//             return { canUpdate: false, message: "Hóa đơn không ở trạng thái mua" };
//         }
//     } catch (error) {
//         return { canUpdate: false, message: "Lỗi khi kiểm tra trạng thái mua của hóa đơn", error };
//     }
// };


const addMonDatApi = async (req, res, next) => {
    try {
        const result = await addMonDat(req, res, next);
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

const updateMonDatApi = async (req, res, next) => {
    try {
        const result = await updateMonDat(req, res, next);
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
const getDanhSachMonDatByIdHoaDonApi = async (req, res, next) => {
    try {
        const result = await getDanhSachMonDatByIdHoaDon(req, res, next);
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


const deleteMonDatApi = async (req, res, next) => {
    try {
        const result = await deleteMonDat(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}

const deleteMonDatMemApi = async (req, res, next) => {
    try {
        const result = await deleteMonDatMem(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.status(500).json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
        }
    }
}
// Export các hàm API
module.exports = {
    addMonDatApi,
    deleteMonDatApi,
    updateMonDatApi,
    getDanhSachMonDatByIdHoaDonApi,
    deleteMonDatMemApi,
};