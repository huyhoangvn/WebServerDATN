//Website
const { model: KhuyenMai } = require("../../model/KhuyenMai");
const mongo = require('mongoose');
const { parse, startOfDay, endOfDay } = require('date-fns');
const { json } = require("body-parser");
const { data, error } = require('jquery');
const { getTatCaKhuyenMai, ThemKhuyenMai, SuaKhuyenMai } = require('../../controllers/khuyenmai/khuyenmai-controller');
const getList = async (req, res) => {
    try {
        const trang = parseInt(req.query.trang) || 1;
        const soLuongKhuyenMaiTrenTrang = 10;
        const soLuongKhuyenMai = await getTatCaKhuyenMai(req, res);
        const totalPages = Math.ceil(soLuongKhuyenMai.count / soLuongKhuyenMaiTrenTrang);
        const result = await getTatCaKhuyenMai(req, res);
        res.render("khuyenmai/danh-sach", {
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

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}
const getViewAdd = async (req, res) => {
    res.render("khuyenmai/them-moi", {
        admin: req.session.ten,
    });
}
const getAdd = async (req, res) => {
    let msg = "";
    const tieuDe = req.body.tieuDe;
    const maKhuyenMai = generateRandomString(6);
    const ngayBatDau = new Date(req.body.ngayBatDau);
    const ngayHetHan = new Date(req.body.ngayHetHan);
    const phanTramKhuyenMai = req.body.phanTramKhuyenMai;
    const donToiThieu = req.body.donToiThieu;

    try {
        const khuyenMaiDaCo = await KhuyenMai.findOne({ maKhuyenMai: maKhuyenMai })
        if (khuyenMaiDaCo) {
            if (khuyenMaiDaCo.trangThai === false) {
                await KhuyenMai.updateOne({ maKhuyenMai }, { trangThai: true });
                const index = await KhuyenMai.findOne({ maKhuyenMai: maKhuyenMai });
                res.render("khuyenmai/them-moi", {
                    index,
                    message: 'Thêm khuyến mãi lại thành công',
                    success: true
                });
            } else if (khuyenMaiDaCo.trangThai != false) {
                res.render("khuyenmai/them-moi", {
                    error: 'Thêm khuyễn mãi lỗi do thiếu thông tin',
                    success: false
                });
            }
        } else if (tieuDe == "" || maKhuyenMai == "" || ngayBatDau == "" || ngayHetHan == "" || phanTramKhuyenMai == "" || donToiThieu == "") {
            res.render("khuyenmai/them-moi", {
                error: 'Thêm khuyễn mãi lỗi do thiếu thông tin',
                success: false
            });
        } else {
            const index = await KhuyenMai.create({
                tieuDe: tieuDe,
                maKhuyenMai: maKhuyenMai,
                ngayBatDau: ngayBatDau,
                ngayHetHan: ngayHetHan,
                phanTramKhuyenMai: phanTramKhuyenMai,
                donToiThieu: donToiThieu,
                trangThai: true
            })
            res.render("khuyenmai/them-moi", {
                admin: req.session.ten,
            });
        }
    } catch (error) {
        console.error(error);
        return {
            error: 'Lỗi khi thêm khuyến mãi',
            success: false
        };
    }

}
const updateKhuyenMai = async (req, res) => {

    const index = await SuaKhuyenMai(req, res);
    res.render("khuyenmai/danh-sach", {
        index: index,
        admin: req.session.ten,
    });
}

module.exports = {
    getList,
    getAdd,
    getViewAdd,
    updateKhuyenMai
}