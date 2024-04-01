const { model: CuaHang } = require("../../model/CuaHang");
const { model: Mon } = require("../../model/Mon");
const { model: NhanVien } = require("../../model/NhanVien");

const moment = require('moment');

// Module



const addCuaHang = async (req, res, next) => {
    try {
        // Lấy dữ liệu từ request body
        const tenCH = req.body.tenCH;
        const email = req.body.email;
        const sdt = req.body.sdt;
        const diaChi = req.body.diaChi;
        const thoiGianMo = req.body.thoiGianMo;
        const thoiGianDong = req.body.thoiGianDong;
        const hinhAnh = 'default_image.png';
        const trangThai = 0; // Đặt trạng thái là 0
        // Kiểm tra tính hợp lệ của dữ liệu
        if (!tenCH || !email || !sdt || !diaChi) {
            return res.json({ success: false, msg: 'Vui lòng điền đầy đủ thông tin' });
        }

        // Kiểm tra xem cửa hàng đã tồn tại hay chưa
        const item = await CuaHang.findOne({ tenCH: tenCH });
        if (item) {
            return res.json({ success: false, msg: 'Cửa hàng đã tồn tại', dataSave: undefined });
        }

        // Tạo mới cửa hàng
        const saveCH = await CuaHang.create({
            tenCH: tenCH,
            email: email,
            sdt: sdt,
            diaChi: diaChi,
            thoiGianMo: thoiGianMo,
            thoiGianDong: thoiGianDong,
            hinhAnh: req.protocol +
                "://" +
                req.get("host") +
                "/public/images/" +
                hinhAnh,
            trangThai: trangThai,
        });

        // Trả về kết quả
        return res.json({ success: true, msg: 'Thêm thành công', index: saveCH });
    } catch (e) {
        // Xử lý lỗi
        return res.json({ success: false, msg: 'Đã xảy ra lỗi khi thêm cửa hàng', error: e.message });
    }
};

// const updateCuaHang = async (req, res, next) => {
//     try {
//         const cuaHangId = req.params.id;
//         const item = await CuaHang.findById(cuaHangId);

//         if (!item) {
//             return res.json({ msg: 'Không tìm thấy cửa hàng để cập nhật', dataSave: null });
//         }

//         const tenCH = req.body.tenCH || item.tenCH;
//         const email = req.body.email || item.email;
//         const sdt = req.body.sdt || item.sdt;
//         const diaChi = req.body.diaChi || item.diaChi;
//         const thoiGianMo = req.body.thoiGianMo || item.thoiGianMo;
//         const thoiGianDong = req.body.thoiGianDong || item.thoiGianDong;

//         let hinhAnh = item.hinhAnh; // Mặc định sử dụng ảnh hiện tại
//         if (req.files && req.files.length > 0) {
//             hinhAnh = req.files[0].filename; // Sử dụng tên của file đầu tiên nếu chỉ cho phép một file
//         }
//         const trangThai = 0;

//         const updateFields = {
//             tenCH: tenCH,
//             email: email,
//             sdt: sdt,
//             diaChi: diaChi,
//             thoiGianMo: thoiGianMo,
//             thoiGianDong: thoiGianDong,
//             hinhAnh: hinhAnh,
//             trangThai: trangThai,
//         };

//         const updatedCH = await CuaHang.findByIdAndUpdate(
//             cuaHangId,
//             { $set: updateFields },
//             { new: true }
//         );

//         return res.json({ msg: 'Cập nhật thành công', dataSave: updatedCH });
//     } catch (error) {
//         // Xử lý lỗi và trả về một thông báo lỗi thân thiện với người dùng
//         console.error(error);
//         return res.json({ msg: 'Đã xảy ra lỗi khi cập nhật cửa hàng', error: 'Lỗi không xác định' });
//     }
// };

const updateCuaHang = async (req, res) => {
    try {
        const cuaHangId = req.params.id;
        const item = await CuaHang.findById(cuaHangId);

        if (!item) {
            return res.json({ msg: 'Không tìm thấy cửa hàng để cập nhật', dataSave: null });
        }

        const tenCH = req.body.tenCH || item.tenCH;
        const email = req.body.email || item.email;
        const sdt = req.body.sdt || item.sdt;
        const diaChi = req.body.diaChi || item.diaChi;
        const thoiGianMo = req.body.thoiGianMo || item.thoiGianMo;
        const thoiGianDong = req.body.thoiGianDong || item.thoiGianDong;

        let hinhAnh = item.hinhAnh; // Mặc định sử dụng ảnh hiện tại

        // Kiểm tra xem có tệp được tải lên hay không
        if (req.files && req.files.length > 0) {
            // Sử dụng tên của tệp đầu tiên nếu chỉ cho phép một tệp
            hinhAnh = req.files[0].filename;
        }

        const trangThai = 0;
        const updateFields = {
            tenCH: tenCH,
            email: email,
            sdt: sdt,
            diaChi: diaChi,
            thoiGianMo: thoiGianMo,
            thoiGianDong: thoiGianDong,
            hinhAnh: hinhAnh,
            trangThai: trangThai,
        };

        const updatedCH = await CuaHang.findByIdAndUpdate(
            cuaHangId,
            { $set: updateFields },
            { new: true }
        );
        // Kiểm tra xem đã gửi phản hồi chưa trước khi tiếp tục
        if (res.headersSent) {
            console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi kết quả.");
        } else {
            // Trả về kết quả thay vì gửi phản hồi trực tiếp
            return {
                success: true,
                msg: 'Cập nhật thành công', dataSave: updatedCH
            };
        }
    } catch (error) {
        // Xử lý lỗi và cung cấp một thông báo lỗi thân thiện với người dùng
        console.error(error);
        return { success: false, msg: 'Đã xảy ra lỗi khi cập nhật cửa hàng', error: 'Lỗi không xác định' };
    }
};




const kichHoatCuaHang = async (req, res, next) => {
    try {
        const id = req.params.id;
        const kichHoat = await CuaHang.findOneAndUpdate(
            { _id: id },
            { $set: { trangThai: 1 } },
            { new: true } // Trả về bản ghi đã được cập nhật
        );
        if (!kichHoat) {
            return res.json({ success: false, msg: "Không tìm thấy cửa hàng" });
        }
        res.json({
            success: true,
            msg: "đã kích hoạt cửa hàng",
            data: kichHoat,
        });
    } catch (e) {
        console.log(e);
        res.json(e);
    };
}
// get all: http://localhost:3000/api/nhanvien/cuahang
//tìm tên: http://localhost:3000/api/nhanvien/cuahang?ten=1234
//tim địa chỉ: http://localhost:3000/api/nhanvien/cuahang?diaChi=123
//time : http://localhost:3000/api/nhanvien/cuahang?thoiGianMo= 09:00 AM&thoiGianDong= 10:00 PM
// tìm all từ khoá: http://localhost:3000/api/nhanvien/cuahang?ten=123&diaChi=123&thoiGianMo= 09:00 AM&thoiGianDong= 10:00 PM
const getCuaHang = async (req, res, next) => {
    try {
        let filter = {};

        if (req.query.ten) {
            filter.tenCH = new RegExp(req.query.ten, 'i');
        }

        if (req.query.diaChi) {
            filter.diaChi = new RegExp(req.query.diaChi, 'i');
        }

        if (req.query.thoiGianMo) {
            filter.thoiGianMo = { $gte: moment(req.query.thoiGianMo, 'hh:mm A').format('HH:mm A') };
        }

        if (req.query.thoiGianDong) {
            filter.thoiGianDong = { $lte: moment(req.query.thoiGianDong, 'hh:mm A').format('HH:mm A') };
        }

        const danhSachCuaHang = await CuaHang.find(filter);

        res.json({
            data: danhSachCuaHang,
            soluong: danhSachCuaHang.length,
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, msg: 'Đã xảy ra lỗi khi lấy danh sách cửa hàng' });
    }
}


const huyKichHoatCuaHang = async (req, res, next) => {
    try {
        const id = req.params.id;
        const huyKichHoat = await CuaHang.findOneAndUpdate(
            { _id: id },
            { $set: { trangThai: 0 } },
            { new: true } // Trả về bản ghi đã được cập nhật
        );

        if (!huyKichHoat) {
            return res.json({ success: false, msg: "Không tìm thấy cửa hàng" });
        }

        res.json({
            success: true,
            msg: "Đã hủy kích hoạt cửa hàng",
            data: huyKichHoat,
        });
    } catch (e) {
        console.log(e);
        res.json({ success: false, msg: "Đã xảy ra lỗi khi hủy kích hoạt cửa hàng" });
    }
};


const chiTietCuaHang = async (req, res, next) => {
    try {
        const id = req.params.id;

        // Step 1: Lấy thông tin cửa hàng từ cơ sở dữ liệu
        const item = await CuaHang.findById(id);

        if (!item) {
            return res.json({ success: false, msg: "Không tìm thấy cửa hàng" });
        }

        // Step 2: Lấy danh sách nhân viên thuộc cửa hàng và số lượng nhân viên
        const pageNhanVien = parseInt(req.query.pageNhanVien) || 1; // Trang hiện tại
        const limitNhanVien = parseInt(req.query.limitNhanVien) || 10; // Số lượng nhân viên trên mỗi trang
        const skipNhanVien = (pageNhanVien - 1) * limitNhanVien; // Số bản ghi bỏ qua
        const nhanVienQuery = NhanVien.find({ idCH: id }).skip(skipNhanVien).limit(limitNhanVien);
        const nhanVien = await nhanVienQuery.exec();
        const totalNhanVien = await NhanVien.countDocuments({ idCH: id });

        // Step 3: Lấy danh sách món ăn thuộc cửa hàng
        const pageMonAn = parseInt(req.query.pageMonAn) || 1; // Trang hiện tại
        const limitMonAn = parseInt(req.query.limitMonAn) || 10; // Số lượng món ăn trên mỗi trang
        const skipMonAn = (pageMonAn - 1) * limitMonAn; // Số bản ghi bỏ qua
        const monAnQuery = Mon.find({ idCH: id }).skip(skipMonAn).limit(limitMonAn);
        const monAn = await monAnQuery.exec();
        const totalMonAn = await Mon.countDocuments({ idCH: id });



        // Trả về phản hồi
        return {
            success: true,
            msg: "Lấy chi tiết thành công",
            data: {
                cuaHang: {
                    _id: item._id,
                    tenCH: item.tenCH,
                    email: item.email,
                    sdt: item.sdt,
                    diaChi: item.diaChi,
                    soLuongNhanVien: totalNhanVien,
                    thoiGianMo: item.thoiGianMo,
                    thoiGianDong: item.thoiGianDong,
                    hinhAnh: `${req.protocol}://${req.get("host")}/public/images/${item.hinhAnh}`,
                    trangThai: item.trangThai

                },
                danhSachNhanVien: {
                    currentPage: pageNhanVien,
                    totalItems: totalNhanVien,
                    totalPages: Math.ceil(totalNhanVien / limitNhanVien),
                    items: nhanVien
                },
                danhSachMonAn: {
                    currentPage: pageMonAn,
                    totalItems: totalMonAn,
                    totalPages: Math.ceil(totalMonAn / limitMonAn),
                    items: monAn
                }
            }
        }

    } catch (e) {
        console.log(e);
        res.json({ success: false, msg: "Đã xảy ra lỗi khi lấy chi tiết cửa hàng" });
    }
};


// api
const addCuaHangApi = async (req, res, next) => {
    try {
        const result = await addCuaHang(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ success: false, msg: 'Đã xảy ra lỗi khi thêm cửa hàng', error: error.message });
        }
    }
}

const updateCuaHangApi = async (req, res, next) => {
    try {
        const result = await updateCuaHang(req, res, next);
        if (!res.headersSent) {
            // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi
            res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
        } else {
            console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi kết quả.");
        }
    } catch (error) {
        // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi lỗi
        if (!res.headersSent) {
            res.json({ success: false, msg: 'Đã xảy ra lỗi khi update cửa hàng', error: error.message });
        } else {
            console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        }
    }
}



const kichHoatCuaHangApi = async (req, res, next) => {
    try {
        const result = await kichHoatCuaHang(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ success: false, msg: 'Đã xảy ra lỗi khi kích hoạt cửa hàng', error: error.message });
        }
    }
}

const huyKichHoatCuaHangApi = async (req, res, next) => {
    try {
        const result = await huyKichHoatCuaHang(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ success: false, msg: 'Đã xảy ra lỗi khi kích hoạt cửa hàng', error: error.message });
        }
    }
}


const getCuaHangCuaHangApi = async (req, res, next) => {
    try {
        const result = await getCuaHang(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ success: false, msg: 'Đã xảy ra lỗi khi kích hoạt cửa hàng', error: error.message });
        }
    }
}


const chiTietCuaHangApi = async (req, res, next) => {
    try {
        const result = await chiTietCuaHang(req, res, next);
        res.json(result);  // Send the result directly without using JSON.stringify
    } catch (error) {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
        } else {
            res.json({ success: false, msg: 'Đã xảy ra lỗi khi kích hoạt cửa hàng', error: error.message });
        }
    }
}



module.exports = {
    // Api
    addCuaHangApi,
    updateCuaHangApi,
    kichHoatCuaHangApi,
    huyKichHoatCuaHangApi,
    getCuaHangCuaHangApi,
    chiTietCuaHangApi
};
