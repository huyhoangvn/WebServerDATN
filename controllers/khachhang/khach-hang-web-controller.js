//Website
const { model: KhachHang } = require("../../model/KhachHang");
const mongo = require('mongoose');

const getList = async (req, res) => {
    try {
        const trang = parseInt(req.query.trang) || 1;
        const soKhachHangTrenTrang = 8;
        const soLuongKhachHang = await KhachHang.countDocuments({});
        const totalPages = Math.ceil(soLuongKhachHang / soKhachHangTrenTrang);
        const data1 = await KhachHang.find({})
            .skip((trang - 1) * soKhachHangTrenTrang)
            .limit(soKhachHangTrenTrang);


        const allData = [];
        for (var i = 0; i < data1.length; i++) {

            const khachHangData = {
                tenKH: data1[i].tenKH,
                gioiTinh: data1[i].gioiTinh,
                taiKhoan: data1[i].taiKhoan,
                trangThai: data1[i].trangThai,
                sdt: data1[i].sdt,
                matKhau: data1[i].matKhau,
                hinhAnh: data1[i].hinhAnh,
                diaChi: data1[i].diaChi,

            };

            allData.push(khachHangData);
        }

        res.render("khachhang/danh-sach", {
            data: allData,
            admin: req.session.ten,
            msg: "",
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
