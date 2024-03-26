//Website
const { model: KhachHang } = require("../../model/KhachHang");
const mongo = require('mongoose');
const { getKhachHangTheoTen, getSoLuongKhachHang, chiTietKhachHang } = require('../../controllers/khachhang/khachhang-controller');
const { response } = require("express");

const getList = async (req, res) => {
    try {
        const trang = parseInt(req.query.trang) || 1;
        const soKhachHangTrenTrang = 10;
        const soLuongKhachHang = await getSoLuongKhachHang(req, res);
        const totalPages = Math.ceil(soLuongKhachHang.count / soKhachHangTrenTrang);
        const result = await getKhachHangTheoTen(req, res);
        console.log(result);
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
};

const getChiTietKhachHang = async (req, res) => {
    try {
        const idKH = new mongo.Types.ObjectId(req.params.idKH);
        const data = await KhachHang.findById(idKH);//tìm món theo id
        console.log(data)
        res.render("khachhang/chi-tiet", {
            index: data,
            admin: req.session.ten,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

module.exports = {
    getList,
    getChiTietKhachHang,
}
