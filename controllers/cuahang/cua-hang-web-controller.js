//Website
const { model: CuaHang } = require("../../model/CuaHang");
const { model: NhanVien } = require("../../model/NhanVien");
const mongo = require('mongoose');
var CuaHangCtrl = require("../../controllers/cuahang/cuahang-controller");

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
    await CuaHangCtrl.deleteCuaHangWeb(req, res)
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
    try {
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        if (tenCH == "" || email == "" || sdt == "" || diaChi == "") {
            res.render("cuahang/them-moi", {
                alert: 'Thêm cửa hàng lỗi do thiếu thông tin',
                success: false
            });
        }
        else if (tenCH.length > 50 || email.length > 50 || sdt.length > 10 || diaChi.length > 100) {
            res.render("cuahang/them-moi", {
                alert: 'các trường nhập vào đang quá ký tự cho phép',
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

        const NVQL = await NhanVien.find({ idCH: idCH, phanQuyen: 0 });

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
        const NVQL = await NhanVien.find({ idCH: idCH, phanQuyen: 0 });
        const taiKhoanTonTai = await NhanVien.findOne({ taiKhoan: taiKhoan });
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
        } else if (tenNV.length > 50 || taiKhoan.length > 50 || matKhau.length > 50 || diaChi.length > 100 || sdt.length > 10) {

            const chiTiet = await CuaHangCtrl.chiTietCuaHangWeb(req, res);
            res.render("cuahang/chi-tiet", {
                NVQL,
                chiTietCH: chiTiet.data.cuaHang,
                monCH: chiTiet.data.danhSachMonAn.items,
                msg: 'Thêm nhân viên quản lý lỗi do thiếu thông tin',
                success: false,
                alert: " thêm thông tin lỗi do có thông tin thừa số lượng ký tự cho phép"
            });
        } else if (NVQL.length >= 5) {

            const chiTiet = await CuaHangCtrl.chiTietCuaHangWeb(req, res);
            res.render("cuahang/chi-tiet", {
                NVQL,
                chiTietCH: chiTiet.data.cuaHang,
                monCH: chiTiet.data.danhSachMonAn.items,
                msg: 'Số lượng nhân viên quản lý đã đạt tối đa. Vui lòng xóa một nhân viên quản lý trước khi thêm mới.',
                success: false,
                alert: " Số lượng nhân viên quản lý đã đạt tối đa. Vui lòng xóa một nhân viên quản lý trước khi thêm mới."
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
            res.redirect("/cua-hang/chi-tiet/" + index.idCH);
        }
    } catch (error) {
        console.error(error);
        return {
            error: 'Lỗi khi thêm nhân viên quản lý',
            success: false
        };
    }

}

module.exports = {
    getList,
    getAdd,
    getAddView,
    chiTietCuaHang,
    themNhanVienQuanLy,
    xoaCuaHang
}