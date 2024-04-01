const { model: HoaDon } = require("../../model/HoaDon");
const mongo = require('mongoose');
const { parse, startOfDay, endOfDay } = require('date-fns');
const { json } = require("body-parser");
const { data, error } = require('jquery');
const hoadon = require("../../controllers/hoadon/hoadon-controller");

const getList = async (req, res, next) => {
    try {
        const trang = parseInt(req.query.trang) || 1;
        const soLuongHoaDonTrenTrang = 10;
        const soLuongHoaDon = await hoadon.getSoLuongHoaDon(req, res);
        const totalPages = Math.ceil(soLuongHoaDon.count / soLuongHoaDonTrenTrang);
        const result = await hoadon.getHoaDon(req, res);
        res.render("hoadon/danh-sach", {
            data: result.list,
            admin: req.session.ten,
            totalPages: totalPages,
            currentPage: trang,
        });

    } catch (error) {
        console.error("Error fetching data:", error);

    }
}

const getChiTiet = async (req, res, next) => {
    try {
        const data = await hoadon.chiTietHoaDon(req, res);
        if (!data) {
            return res.status(500).json({ error: "Đã xảy ra lỗi khi lấy chi tiết hóa đơn" });
        }
        res.render("hoadon/chi-tiet", {
            index: data.hoaDon,
            data: data.monDat,
            admin: req.session.ten,
            msg: ""
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Đã xảy ra lỗi khi lấy chi tiết hóa đơn" });
    }
};

module.exports = {
    getList,
    getChiTiet
}