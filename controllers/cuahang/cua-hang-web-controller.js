//Website
const { model: CuaHang } = require("../../model/CuaHang");
var CuaHangCtrl = require("../../controllers/cuahang/cuahang-controller");
const getList = async (req, res, next) => {
    const trang = parseInt( req.query.trang ) || 1;
    const listCH = await CuaHangCtrl.GetCuaHang(req, res);
    const soCuaHangTrenTrang = 10; 
    const soLuongCuaHang = await CuaHangCtrl.GetSoLuongCuaHang(req, res);
    const totalPages = Math.ceil(soLuongCuaHang.index / soCuaHangTrenTrang);
    res.render("cuahang/danh-sach", {
        count:soLuongCuaHang.index,
        totalPages,
        currentPage:trang,
        listCH:listCH.index,  
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
                error: 'Thêm cửa hàng lỗi do thiếu thông tin',
                success: false
            });
        }
        else if (!timeRegex.test(thoiGianMo) || !timeRegex.test(thoiGianDong)) {
            res.render("cuahang/them-moi", {
                error: 'Định dạng thời gian không hợp lệ. Vui lòng nhập lại theo định dạng 00:00:00',
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
            res.render("cuahang/them-moi", {
                admin: req.session.ten,
            });
        }
    } catch (error) {
        console.error(error);
        return {
            error: 'Lỗi khi thêm cửa hàng',
            success: false
        };
    }
}

module.exports = {
    getList,
    getAdd,
    getAddView
}