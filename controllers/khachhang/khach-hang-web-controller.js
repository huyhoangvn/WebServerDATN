//Website
const { model: KhachHang } = require("../../model/KhachHang");
const mongo = require('mongoose');
const { getKhachHangTheoTen, getSoLuongKhachHang } = require('../../controllers/khachhang/khachhang-controller');

const getList = async (req, res) => {
    try {
        const trang = parseInt(req.query.trang) || 1;
        const soKhachHangTrenTrang = 10;
        const soLuongKhachHang = await getSoLuongKhachHang(req, res);
        const totalPages = Math.ceil(soLuongKhachHang.count / soKhachHangTrenTrang);
        const result = await getKhachHangTheoTen(req, res);
        res.render("khachhang/danh-sach", {
            data: result.list,
            admin: req.session.ten,
            msg: result.list,
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
