//Website
const { model: CuaHang } = require("../../model/CuaHang");
const { model: NhanVien } = require("../../model/NhanVien");
const { model: Mon } = require("../../model/Mon");
const mongo = require('mongoose');
var CuaHangCtrl = require("../../controllers/cuahang/cuahang-controller");
var MonCtrl = require("../../controllers/mon/mon-controller");
const nhanVien = require("../../controllers/nhanvien/nhanvienquanly-controller");

const getList = async (req, res, next) => {
    const trang = parseInt(req.query.trang) || 1;
    const listCH = await CuaHangCtrl.GetCuaHang(req, res);
    const soCuaHangTrenTrang = 10;
    const soLuongCuaHang = await CuaHangCtrl.GetSoLuongCuaHang(req, res);
    const totalPages = Math.ceil(soLuongCuaHang.index / soCuaHangTrenTrang);
    res.render("cuahang/danh-sach", {
        count: soLuongCuaHang.index,
        totalPages,
        currentPage: trang,
        listCH: listCH.index,
        admin: req.session.ten,
        msg: ""
    })
}
const xoaCuaHang = async (req, res, next) => {
    const xoaCH = await CuaHangCtrl.deleteCuaHangWeb(req, res)
    const trang = parseInt(req.query.trang) || 1;
    const listCH = await CuaHangCtrl.GetCuaHang(req, res);
    const soCuaHangTrenTrang = 10;
    const soLuongCuaHang = await CuaHangCtrl.GetSoLuongCuaHang(req, res);
    const totalPages = Math.ceil(soLuongCuaHang.index / soCuaHangTrenTrang);
    res.render("cuahang/danh-sach", {
        alert:xoaCH.msg,
        count: soLuongCuaHang.index,
        totalPages,
        currentPage: trang,
        listCH: listCH.index,
        admin: req.session.ten,
        msg: ""
    })
}

const getAddView = async (req, res, next) => {
    res.render("cuahang/them-moi", {
        admin: req.session.ten,
        msg: ""
    })
}
const getAdd = async (req, res, next) => {

    const tenCH = req.body.tenCH;
    const email = req.body.email;
    const sdt = req.body.sdt;
    const diaChi = req.body.diaChi;
    const thoiGianMo = req.body.thoiGianMo;
    const thoiGianDong = req.body.thoiGianDong;
    const hinhAnh = 'default_image.png';
    const trangThai = 0; // Đặt trạng thái là 0
    // Kiểm tra tính hợp lệ của dữ liệu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        if (tenCH == "" || email == "" || sdt == "" || diaChi == "") {
            res.render("cuahang/them-moi", {
                alert: 'Thêm cửa hàng lỗi do thiếu thông tin',
                success: false
            });
        }
        else if (tenCH.length > 50) {
            res.render("cuahang/them-moi", {
                alert: 'tên cửa hàng đang quá ký tự cho phép',
                success: false
            });
        }
        else if (email.length > 50) {
            res.render("cuahang/them-moi", {
                alert: 'email nhập  vào đang quá ký tự cho phép',
                success: false
            });
        }
        else if (!emailRegex.test(email)) {
            res.render("cuahang/them-moi", {
                alert: 'Định dạng email không hợp lệ. Vui lòng nhập lại.',
                success: false
            });
        }
        else if (sdt.length > 10) {
            res.render("cuahang/them-moi", {
                alert: 'số điện thoại nhập vào đang quá ký tự cho phép',
                success: false
            });
        }
        else if (diaChi.length > 100) {
            res.render("cuahang/them-moi", {
                alert: 'địa chỉ nhập vào đang quá ký tự cho phép',
                success: false
            });
        }
        else if (!timeRegex.test(thoiGianMo) || !timeRegex.test(thoiGianDong)) {
            res.render("cuahang/them-moi", {
                alert: 'Định dạng thời gian không hợp lệ. Vui lòng nhập lại theo định dạng 00:00:00',
                success: false
            });
        } else {
            const index = await CuaHang.create({
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
            res.redirect("/cua-hang/chi-tiet/" + index._id);
        }
    } catch (error) {
        console.error(error);
        return {
            error: 'Lỗi khi thêm cửa hàng',
            success: false
        };
    }
}

const chiTietCuaHang = async (req, res, next) => {
    try {
        const idCH = new mongo.Types.ObjectId(req.params.idCH);
        const chiTiet = await CuaHangCtrl.chiTietCuaHangWeb(req, res);

        const NVQL = await NhanVien.find({ idCH: idCH, phanQuyen: 0, trangThai: true });

        res.render("cuahang/chi-tiet", {
            NVQL,
            chiTietCH: chiTiet.data.cuaHang,
            monCH: chiTiet.data.danhSachMonAn.items,
            admin: req.session.ten,
            msg: ""
        })
        // Render view và truyền dữ liệu cần hiển thị vào view
    } catch (error) {
        console.log(error);
        res.status(500).send('Đã xảy ra lỗi khi hiển thị chi tiết cửa hàng');
    }
}
const themNhanVienQuanLy = async (req, res) => {
    try {
        let msg = "";
        const idCH = new mongo.Types.ObjectId(req.params.idCH);
        const taiKhoan = req.body.taiKhoan;
        const matKhau = req.body.matKhau;
        const tenNV = req.body.tenNV;
        const gioiTinh = req.body.gioiTinh;
        const hinhAnh = req.body.hinhAnh || 'default_image.png';
        const sdt = req.body.sdt;
        const diaChi = req.body.diaChi;
        const phanQuyen = 2;
        const trangThai = 1;
        const NVQL = await NhanVien.find({ idCH: idCH, phanQuyen: 0, trangThai: true });
        const taiKhoanTonTai = await NhanVien.findOne({ idCH: idCH, taiKhoan: taiKhoan });
        if (taiKhoanTonTai) {
            // Nếu tài khoản đã tồn tại, trả về một thông báo lỗi
            const chiTiet = await CuaHangCtrl.chiTietCuaHangWeb(req, res);
            return res.render("cuahang/chi-tiet", {
                NVQL,
                chiTietCH: chiTiet.data.cuaHang,
                monCH: chiTiet.data.danhSachMonAn.items,
                msg: 'Tài khoản đã tồn tại. Vui lòng chọn tài khoản khác.',
                success: false,
                alert: "Tài khoản đã tồn tại. Vui lòng chọn tài khoản khác."
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (taiKhoan == "" || matKhau == "" || sdt == "" || diaChi == "" || tenNV == "" || gioiTinh == "") {
            const chiTiet = await CuaHangCtrl.chiTietCuaHangWeb(req, res);
            res.render("cuahang/chi-tiet", {
                NVQL,
                chiTietCH: chiTiet.data.cuaHang,
                monCH: chiTiet.data.danhSachMonAn.items,
                msg: 'Thêm nhân viên quản lý lỗi do thiếu thông tin',
                success: false,
                alert: " Thêm nhân viên quản lý lỗi do thiếu thông tin"
            });
        } else if (tenNV.length > 50) {
            const chiTiet = await CuaHangCtrl.chiTietCuaHangWeb(req, res);
            res.render("cuahang/chi-tiet", {
                NVQL,
                chiTietCH: chiTiet.data.cuaHang,
                monCH: chiTiet.data.danhSachMonAn.items,
                msg: 'Thêm nhân viên quản lý lỗi do thiếu thông tin',
                success: false,
                alert: " Tên nhân viên vượt quá ký tự cho phép"
            });
        }
        else if (taiKhoan.length > 50 || taiKhoan.length < 6) {
            const chiTiet = await CuaHangCtrl.chiTietCuaHangWeb(req, res);
            res.render("cuahang/chi-tiet", {
                NVQL,
                chiTietCH: chiTiet.data.cuaHang,
                monCH: chiTiet.data.danhSachMonAn.items,
                msg: 'Thêm nhân viên quản lý lỗi do thiếu thông tin',
                success: false,
                alert: " Tài khoản vượt quá hoặc không đạt số lượng ký tự cho phép"
            });
        }
        else if (!emailRegex.test(taiKhoan)) {
            const chiTiet = await CuaHangCtrl.chiTietCuaHangWeb(req, res);
            res.render("cuahang/chi-tiet", {
                NVQL,
                chiTietCH: chiTiet.data.cuaHang,
                monCH: chiTiet.data.danhSachMonAn.items,
                msg: 'Thêm nhân viên quản lý lỗi do thiếu thông tin',
                success: false,
                alert: " tài khoản định dạng không hợp lệ"
            });
        }
        else if (matKhau.length > 50 || matKhau.length < 6) {
            const chiTiet = await CuaHangCtrl.chiTietCuaHangWeb(req, res);
            res.render("cuahang/chi-tiet", {
                NVQL,
                chiTietCH: chiTiet.data.cuaHang,
                monCH: chiTiet.data.danhSachMonAn.items,
                msg: 'Thêm nhân viên quản lý lỗi do thiếu thông tin',
                success: false,
                alert: " mật Khẩu vượt quá ký tự hoặc chưa đủ ký tự cho phép "
            });
        }
        else if (diaChi.length > 100) {
            const chiTiet = await CuaHangCtrl.chiTietCuaHangWeb(req, res);
            res.render("cuahang/chi-tiet", {
                NVQL,
                chiTietCH: chiTiet.data.cuaHang,
                monCH: chiTiet.data.danhSachMonAn.items,
                msg: 'Thêm nhân viên quản lý lỗi do thiếu thông tin',
                success: false,
                alert: " Địa chỉ vượt quá ký tự cho phép"
            });
        }
        else if (sdt.length > 10) {
            const chiTiet = await CuaHangCtrl.chiTietCuaHangWeb(req, res);
            res.render("cuahang/chi-tiet", {
                NVQL,
                chiTietCH: chiTiet.data.cuaHang,
                monCH: chiTiet.data.danhSachMonAn.items,
                msg: 'Thêm nhân viên quản lý lỗi do thiếu thông tin',
                success: false,
                alert: " Số điện thoại vượt quá ký tự cho phép"
            });
        }
        else {
            const index = await NhanVien.create({
                idCH: idCH,
                taiKhoan: taiKhoan,
                matKhau: matKhau,
                sdt: sdt,
                diaChi: diaChi,
                tenNV: tenNV,
                gioiTinh: gioiTinh,
                hinhAnh: req.protocol +
                    "://" +
                    req.get("host") +
                    "/public/images/" +
                    hinhAnh,
                phanQuyen: phanQuyen,
                trangThai: trangThai,
            });
            if(index.success){
                res.redirect("/cua-hang/chi-tiet/" + index.idCH+"?sua=true");   
            } else {
                res.redirect("/cua-hang/chi-tiet/" + index.idCH+"?sua=false");   
            }
        }
    } catch (error) {
        console.error(error);
        return {
            error: 'Lỗi khi thêm nhân viên quản lý',
            success: false
        };
    }

}

const xoaNhanVien = async (req, res, next) => {
    try {
        const idCH1 = new mongo.Types.ObjectId(req.body.idCH1);
        const data = await nhanVien.XoaQuanLy(req, res);

        if(data.success == true){
            res.redirect("/cua-hang/chi-tiet/"+idCH1+"?sua=true");   
        } else {
            res.redirect("/cua-hang/chi-tiet/"+idCH1+"?sua=false");   
        }
    } catch (error) {
        console.error("Error fetching data:", error);

    }
}

const xoaMon = async (req, res) => {
    const idMon = new mongo.Types.ObjectId(req.params.idMon) 
    const monTim = await Mon.findOne({_id:idMon})
    const idCH =monTim.idCH;
    const data = await MonCtrl.deleteMonWeb(req, res);
    if(data.success == true){
        res.redirect("/cua-hang/chi-tiet/"+idCH+"?sua=true");   
    } else {
        res.redirect("/cua-hang/chi-tiet/"+idCH+"?sua=false");   
    }

}

module.exports = {
    getList,
    getAdd,
    getAddView,
    chiTietCuaHang,
    themNhanVienQuanLy,
    xoaCuaHang,
    xoaNhanVien,
    xoaMon
}