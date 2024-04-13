const { model: MonDat } = require("../../model/MonDat");
const { model: HoaDon } = require("../../model/HoaDon");
const { model: Mon } = require("../../model/Mon");
const { model: KhuyenMai } = require("../../model/KhuyenMai");
const { model: KhachHang } = require("../../model/KhachHang");
const { model: CuaHang } = require("../../model/CuaHang");
const mongoose = require('mongoose');
const mongo = mongoose.Types.ObjectId;

const addHoaDonVaMonDat = async (req, res, next) => {
    let hoaDonId = null; // Biến để lưu ID của hóa đơn, để sử dụng trong trường hợp cần xóa

    try {
        let idKM = "";
        let phanTramKhuyenMaiDat = 0;
        try {
            idKM = req.body.idKM;
            // Kiểm tra khuyến mãi
            const khuyenMai = await KhuyenMai.findById(idKM);

            phanTramKhuyenMaiDat = khuyenMai.phanTramKhuyenMai;
        } catch (e) {

        }
        const { idCH, diaChiGiaoHang, list, idKH } = req.body;

        if (!idKH || !idCH || !diaChiGiaoHang || !list) {
            return res.json({ msg: 'Vui lòng điền đầy đủ thông tin', success: false });
        }
        // Kiểm tra khách hàng
        const khachHang = await KhachHang.findById(idKH);
        if (!khachHang || !khachHang.trangThai) {
            return res.json({ msg: 'Khách hàng không tồn tại hoặc không hoạt động', success: false });
        }

        if (!khachHang || !khachHang.sdt) {
            return res.json({ msg: 'khánh hàng vui lòng nhập số điện thoại', success: false });
        }

        // Kiểm tra cửa hàng
        const cuaHang = await CuaHang.findById(idCH);
        if (!cuaHang || !cuaHang.trangThai) {
            return res.json({ msg: 'Cửa hàng không tồn tại hoặc không hoạt động', success: false });
        }
        let tongTien = 0;
        let thanhTien = 0;
        let phiGiaoHang = 24000;

        // Tạo hóa đơn
        const hoaDon = await HoaDon.create({
            idKH,
            idCH,
            diaChiGiaoHang,
            phanTramKhuyenMaiDat,
            trangThaiMua: 0,
            trangThai: true,
            trangThaiThanhToan: 0,
            phiGiaoHang,
            tongTien: 0, // Khởi tạo tổng tiền ban đầu là 0
            thanhTien: 0
        });

        hoaDonId = hoaDon._id; // Lưu ID của hóa đơn



        const monDatList = [];
        for (const mon of list) {
            const { idMon, soLuong } = mon;

            const monObj = await Mon.findOne({ _id: idMon });
            if (!monObj || !monObj.trangThai || monObj.idCH.toString() !== idCH) {
                // Nếu món không hợp lệ, xóa luôn món đặt trước đó
                await HoaDon.findByIdAndDelete(hoaDonId);
                await MonDat.deleteMany({ idHD: hoaDonId });
                return res.json({ msg: 'Các món không cùng cửa hàng, hóa đơn không được tạo thành công', success: false });
            }

            const giaTienDat = monObj.giaTien;
            tongTien += giaTienDat * soLuong;
            thanhTien = (tongTien - Math.ceil(tongTien * phanTramKhuyenMaiDat / 100)) + phiGiaoHang

            const monDat = await MonDat.create({
                idHD: hoaDonId, // Sử dụng ID của hóa đơn
                idMon,
                giaTienDat,
                soLuong
            });

            monDatList.push({
                idMon: mon.idMon,
                giaTien: monObj.giaTien,
                soLuong: mon.soLuong,
                tenMon: monObj.tenMon
            });
        }

        // Nếu không có lỗi, cập nhật tổng tiền vào hóa đơn
        await HoaDon.findByIdAndUpdate(hoaDonId, { tongTien, thanhTien }, { new: true });
        res.json({
            index: hoaDonId,
            message: "Thêm mới hóa đơn và món đặt thành công",
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.json({ message: "Lỗi khi thêm mới hóa đơn và món đặt", error });
    }
}




// Thêm mới món đặt
const addMonDat = async (req, res, next) => {
    try {
        const idHD = req.params.idHD; // Lấy id hóa đơn từ params

        if (!req.body || !req.body.idMon) {
            throw new Error("Thông tin món đặt không đầy đủ hoặc không hợp lệ.");
        }

        const idMon = req.body.idMon;
        if (!idMon) {
            throw new Error("ID món không hợp lệ.");
        }
        const mon = await Mon.findOne({ _id: idMon });
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
        if (hoaDon.trangThaiThanhToan !== 0) {
            throw new Error("Hóa đơn đã được thanh toán.");
        }
        if (hoaDon.trangThaiMua !== 0) {
            throw new Error("Hóa đơn không ở trạng thái Đợi duyệt.");
        }

        const cuaHangMonDat = mon.idCH.toString();
        const cuaHangHoaDon = hoaDon.idCH.toString();
        if (cuaHangMonDat !== cuaHangHoaDon) {
            throw new Error("Món đặt không thuộc cùng một cửa hàng với các món trong hóa đơn.");
        }


        const tongTienMoi = hoaDon.tongTien + (mon.giaTien * req.body.soLuong);


        await HoaDon.findByIdAndUpdate(idHD, { tongTien: tongTienMoi }, { new: true });

        // await updateTongTienHoaDon(idHD);
        // Tạo món đặt mới với id hóa đơn đã được cung cấp
        const mondat = await MonDat.create({
            idHD: idHD,
            idMon: req.body.idMon,
            giaTienDat: mon.giaTien,
            soLuong: req.body.soLuong
        })

        // Trả về kết quả thành công
        return {
            index: mondat,
            msg: "Món đặt đã được thêm thành công",
            success: true
        };
    } catch (e) {
        console.error(e);
        return ({ error: e.message || "Đã xảy ra lỗi khi thêm món đặt" });
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
        const mondat = await MonDat.findByIdAndUpdate(id, {
            soLuong: req.body.soLuong
        });

        // Cập nhật tổng tiền của hóa đơn
        await HoaDon.findByIdAndUpdate(hoaDon._id, { tongTien: tongTienMoi }, { new: true });

        // Trả về kết quả thành công
        return {
            index: mondat,
            msg: "Món đặt đã được cập nhật thành công",
            success: true,
        };
    } catch (e) {
        console.error(e);
        return ({ error: e.message || "Đã xảy ra lỗi khi cập nhật món đặt" });
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
            success: true,
        };
    } catch (e) {
        console.error(e);
        return ({ error: e.message || "Đã xảy ra lỗi khi xóa món đặt" });
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
            return ({ error: "Không tìm thấy hoa đơn" });
        }
        return {
            msg: "update thành công",
            data: trangThai,
        };
    } catch (e) {
        console.log(e);
        return ({ error: "Đã xảy ra lỗi khi update " });
    }
}

const getDanhSachMonDatByIdHoaDon = async (req, res, next) => {
    try {
        const id = req.params.id;
        const page = parseInt(req.query.page) || 1; // Trang mặc định là 1 nếu không được cung cấp
        const pageSize = parseInt(req.query.pageSize) || 10; // Số lượng bản ghi hiển thị trên mỗi trang, mặc định là 10

        let foundHoaDon = await HoaDon.findOne({ _id: id });

        if (!foundHoaDon) {
            return {
                msg: "hóa đơn không tồn tại"
            };
        }

        // Tính chỉ số bắt đầu và giới hạn cho phân trang
        const startIndex = (page - 1) * pageSize;

        // Lấy danh sách món đặt theo ID hóa đơn với phân trang
        const danhSachMonDat = await MonDat.find({ idHD: id }).skip(startIndex).limit(pageSize);

        // Tính toán thông tin về trang
        const total = await MonDat.countDocuments({ idHD: id });
        const totalPages = Math.ceil(total / pageSize);

        // Trả về danh sách món đặt cùng với thông tin phân trang
        return {
            data: danhSachMonDat,
            page,
            totalPages,
            total,
            success: true,
            msg: "danh sách món đặt"
        };
    } catch (error) {
        console.error(error);
        return ({ msg: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn của món đặt', error: error.message });
    }
};



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
            res.json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
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
            res.json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
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
            res.json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
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
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
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
            res.json({ msg: 'Đã xảy ra lỗi khi kích hoạt Hóa Đơn', error: error.message });
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
    addHoaDonVaMonDat
};