const { model: CuaHang } = require("../../model/CuaHang");
const { model: NhanVien } = require("../../model/NhanVien");
const { model: Mon } = require("../../model/Mon");
const mongo = require('mongoose');

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


const updateCuaHang = async (req, res) => {
    try {
        const cuaHangId = req.params.id;
        const item = await CuaHang.findById(cuaHangId);

        if (!item) {
            return res.json({ msg: 'Không tìm thấy cửa hàng để cập nhật', dataSave: null, success: false });
        }

        const tenCH = req.body.tenCH || item.tenCH;
        const email = req.body.email || item.email;
        const sdt = req.body.sdt || item.sdt;
        const diaChi = req.body.diaChi || item.diaChi;
        const thoiGianMo = req.body.thoiGianMo || item.thoiGianMo;
        const thoiGianDong = req.body.thoiGianDong || item.thoiGianDong;

        if (tenCH.length > 50) {
            return res.json({
                success: false,
                msg: 'tên cửa hàng vượt quá số lượng ký tự cho phép'
            });
        }
        if (email.length > 50) {
            return res.json({
                success: false,
                msg: 'email cửa hàng vượt quá số lượng ký tự cho phép'
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({
                success: false,
                msg: 'email không đúng định dạng'
            });
        }
        if (diaChi.length > 100) {
            return res.json({
                success: false,
                msg: 'địa chỉ vượt quá số lượng ký tự cho phép'
            });
        }
        if (sdt.length > 10) {
            return res.json({
                success: false,
                msg: 'số điện thoại vượt quá số lượng ký tự cho phép'
            });
        }

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
            msg: "lấy danh sách thành công"
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, msg: 'Đã xảy ra lỗi khi lấy danh sách cửa hàng' });
    }
}

const GetCuaHang = async (req, res, next) => {
    try {
        let timkiem = {

        };
        const trang = parseInt(req.query.trang) || 1;
        if (typeof (req.query.tenCH) !== 'undefined' && req.query.tenCH !== "") {
            timkiem.tenCH = { $regex: req.query.tenCH, $options: 'i' };
        }
        if (typeof (req.query.diaChi) !== 'undefined' && req.query.diaChi !== "") {
            timkiem.diaChi = { $regex: req.query.diaChi, $options: 'i' };
        }
        if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
            const trangThaiValue = parseInt(req.query.trangThai);
            if (trangThaiValue === 1 || trangThaiValue === 0) {
                timkiem.trangThai = trangThaiValue === 1;
            }
        }
        const listCH = await CuaHang.aggregate([
            {
                $lookup: {
                    from: "NhanVien",
                    localField: "_id",
                    foreignField: "idCH",
                    as: "NhanViens"
                }
            },
            {
                $match:
                    timkiem,
            },
            {
                $project: {
                    "tenCH": "$tenCH",
                    "diaChi": "$diaChi",
                    "sdt": "$sdt",
                    "trangThai": "$trangThai",
                    "idCH": "$_id",
                    "soLuongNhanVien": { $size: "$NhanViens" }
                }
            },
            {
                $skip: (trang - 1) * 10,
            },
            {
                $limit: 10,
            },
        ]);
        const count = await GetSoLuongCuaHang(req, res);
        return ({
            count: count.index,
            index: listCH,
            msg: "get cửa hàng thành công",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return ({ success: false, msg: 'Đã xảy ra lỗi khi lấy danh sách cửa hàng' });
    }
}

const GetSoLuongCuaHang = async (req, res, next) => {
    try {
        let timkiem = {

        };
        const trang = parseInt(req.query.trang) || 1;
        if (typeof (req.query.tenCH) !== 'undefined' && req.query.tenCH !== "") {
            timkiem.tenCH = { $regex: req.query.tenCH, $options: 'i' };
        }
        if (typeof (req.query.diaChi) !== 'undefined' && req.query.diaChi !== "") {
            timkiem.diaChi = { $regex: req.query.diaChi, $options: 'i' };
        }
        if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
            const trangThaiValue = parseInt(req.query.trangThai);
            if (trangThaiValue === 1 || trangThaiValue === 0) {
                timkiem.trangThai = trangThaiValue === 1;
            }
        }
        const listCH = await CuaHang.aggregate([
            {
                $lookup: {
                    from: "NhanVien",
                    localField: "_id",
                    foreignField: "idCH",
                    as: "NhanViens"
                }
            },
            {
                $match:
                    timkiem,
            },
            {
                $count: "count"
            }

        ]);
        return ({
            index: listCH[0].count,
            msg: "get cửa hàng thành công",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return ({ success: false, msg: 'Đã xảy ra lỗi khi lấy danh sách cửa hàng' });
    }
}

const getCuaHangApi = async (req, res) => {
    const result = await GetCuaHang(req, res);
    res.json(result)
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

const deleteCuaHangWeb = async (req, res) => {
    try {
        const idCH = new mongo.Types.ObjectId(req.params.idCH); // Sửa thành idCH
        const filter = { _id: idCH };
        const filterNVCu = await NhanVien.findOne({ idCH: idCH });
        const filterMonCu = await Mon.findOne({ idCH: idCH });
        const cuaHangTim = await CuaHang.findOne({ _id: idCH })

        if (cuaHangTim) { // Kiểm tra xem cuaHangTim có tồn tại không trước khi truy cập vào trangThai
            if (cuaHangTim.trangThai == true) {
                const update = { trangThai: false };
                const filterNV = { idCH: idCH };
                const filterMon = { idCH: idCH };
                const data = await CuaHang.findOneAndUpdate(filter, update, { new: true });
                const MonSua = await Mon.updateMany(filterMon, update, { new: true });
                const nhanVienSua = await NhanVien.updateMany(filterNV, update, { new: true });
                return ({ error: "Xóa của hàng thành công !", success: false });
            } else {
                const update = { trangThai: true };
                const data = await CuaHang.findOneAndUpdate(filter, update, { new: true });
                return ({ error: "Xóa cửa hàng thành công !", success: false });
            }
        } else {
            return ({ msg: "Không tìm thấy cửa hàng", success: false });
        }
    } catch (e) {
        console.log(e);
        return ({ success: false, msg: "Đã xảy ra lỗi " });
    }

}

const chiTietCuaHangWeb = async (req, res, next) => {
    try {
        const idCH = new mongo.Types.ObjectId(req.params.idCH);

        // Step 1: Lấy thông tin cửa hàng từ cơ sở dữ liệu
        const item = await CuaHang.findById(idCH);

        if (!item) {
            return ({ success: false, msg: "Không tìm thấy cửa hàng" });
        }

        // Step 2: Lấy danh sách nhân viên thuộc cửa hàng và số lượng nhân viên
        const pageNhanVien = parseInt(req.query.pageNhanVien) || 1; // Trang hiện tại
        const limitNhanVien = parseInt(req.query.limitNhanVien) || 10; // Số lượng nhân viên trên mỗi trang
        const skipNhanVien = (pageNhanVien - 1) * limitNhanVien; // Số bản ghi bỏ qua
        const nhanVienQuery = NhanVien.find({ idCH: idCH }).skip(skipNhanVien).limit(limitNhanVien);
        const nhanVien = await nhanVienQuery.exec();
        const totalNhanVien = await NhanVien.countDocuments({ idCH: idCH });

        // Step 3: Lấy danh sách món ăn thuộc cửa hàng
        const pageMonAn = parseInt(req.query.pageMonAn) || 1; // Trang hiện tại
        const limitMonAn = parseInt(req.query.limitMonAn) || 10; // Số lượng món ăn trên mỗi trang
        const skipMonAn = (pageMonAn - 1) * limitMonAn; // Số bản ghi bỏ qua
        const monAnQuery = Mon.find({ idCH: idCH })
            .populate('idLM') // Populate thông tin từ collection danh mục món
            .skip(skipMonAn)
            .limit(limitMonAn);
        const monAn = await monAnQuery.exec();
        const totalMonAn = await Mon.countDocuments({ idCH: idCH });



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
                    items: monAn.map(mon => ({
                        _id: mon._id,
                        tenMon: mon.tenMon,
                        giaTien: mon.giaTien,
                        moTa: mon.moTa,
                        tenCH: item.tenCH, // Thêm thông tin tên cửa hàng vào đây
                        tenLM: mon.idLM.tenLM, // Thêm thông tin tên danh mục món vào đây
                        hinhAnh: `${req.protocol}://${req.get("host")}/public/images/${mon.hinhAnh}`,
                        trangThai: mon.trangThai
                    }))
                }
            }
        }

    } catch (e) {
        console.log(e);
        return { success: false, msg: "Đã xảy ra lỗi khi lấy chi tiết cửa hàng" };
    }
};

const chiTietCuaHangApp = async (req, res, next) => {
    try {
        const id = req.params.id;
        const item = await CuaHang.findById(id)
        if (!item) {
            res.json({ success: false, msg: "không tìm thấy cửa hàng" });
        }
        return {
            success: true,
            msg: "Lấy chi tiết thành công",
            data: {
                _id: item._id,
                tenCH: item.tenCH,
                email: item.email,
                sdt: item.sdt,
                diaChi: item.diaChi,
                thoiGianMo: item.thoiGianMo,
                thoiGianDong: item.thoiGianDong,
                hinhAnh: `${req.protocol}://${req.get("host")}/public/images/${item.hinhAnh}`,
                trangThai: item.trangThai
            }
        };
    } catch (e) {
        console.log(e);
        res.json({ success: false, msg: "Đã xảy ra lỗi khi tlấy chi tiết cửa hàng" });
    }
};


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



const chiTietCuaHangAppApi = async (req, res, next) => {
    try {
        const result = await chiTietCuaHangApp(req, res, next);
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

const chiTietCuaHangWebApi = async (req, res, next) => {
    try {
        const result = await chiTietCuaHangWeb(req, res, next);
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

const slideShowMonCuaHang = async (req, res, next) => {
    const list = [
        {
            idMon: "1",
            tenMon: "Gà rán",
            hinhAnh: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB6VtBoRuTrLgpIWKcNfbj96hO_Z9GFuygT7B43qR5Bw&s",
        },
        {
            idMon: "2",
            tenMon: "Beefsteak",
            hinhAnh: "https://ussinavietnam.vn/wp-content/uploads/2022/05/B1_.png",
        },
        {
            idMon: "3",
            tenMon: "Cơm chiên",
            hinhAnh: "https://top10monanngon.files.wordpress.com/2019/10/cach-trang-tri-com-chien-duong-chau.jpg?w=600",
        },
    ];

    res.json({
        index: list,
        success: true,
        msg: "thành công"
    })
};

module.exports = {
    // Api
    updateCuaHangApi,
    kichHoatCuaHangApi,
    huyKichHoatCuaHangApi,
    chiTietCuaHangAppApi,
    chiTietCuaHangWebApi,
    chiTietCuaHangWeb,
    // chiTietCuaHangApi,
    getCuaHang,
    GetCuaHang,
    GetSoLuongCuaHang,
    getCuaHangApi,
    chiTietCuaHangAppApi,
    chiTietCuaHangWebApi,
    deleteCuaHangWeb,
    addCuaHang,
    slideShowMonCuaHang
};
