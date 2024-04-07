//Website
const { model: NhanVien } = require("../../model/NhanVien");
const nhanVien = require("../../controllers/nhanvien/nhanvienquanly-controller");
const getList = async (req, res, next) => {
    try {
        const trang = parseInt(req.query.trang) || 1;
        const soLuongNhanVienTrenTrang = 10;
        const soLuongNhanVien = await nhanVien.getSoLuongNhanVienQuanLy(req, res);
        const totalPages = Math.ceil(soLuongNhanVien.count / soLuongNhanVienTrenTrang);
        const result = await nhanVien.getTatCaNhanVienQuanLy(req, res);
        res.render("cuahang/danh-sach-quan-ly", {
            data: result.list,
            admin: req.session.ten,
            totalPages: totalPages,
            currentPage: trang,
        });
    } catch (error) {
        console.error("Error fetching data:", error);

    }
}

module.exports = {
    getList
}