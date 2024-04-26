//Website
var ThongKeCtrl = require("../../controllers/thongke/thong-ke-controller");
const moment = require('moment');

const getView = async (req, res, next) => {
    res.redirect("/thong-ke/doanh-thu/theo-nam?nam=2024")
}

const getChiTietDoanhThuTheoNam = async (req, res, next) => {
    const nam = req.query.nam;
    const motNgay = await ThongKeCtrl.thongKeDoanhThuTheoNgay(req, res, next);
    const tongTienMotNgay = motNgay ? motNgay.tongTien : 0;
    const muoiNgay = await ThongKeCtrl.thongKeDoanhThuTheo10Ngay(req, res, next);
    const tongTienMuoiNgay = muoiNgay ? muoiNgay.tongTien : 0;
    const baMuoiNgay = await ThongKeCtrl.thongKeDoanhThuTheo30Ngay(req, res, next);
    const tongTienBaMuoiNgay = baMuoiNgay ? baMuoiNgay.tongTien : 0;

    const theoNam = await ThongKeCtrl.thongKeDoanhThuTheoThangTrongNam(req, res, next);

    const tongTienNam = await ThongKeCtrl.thongKeDoanhThuTheoNam(req, res);
    const tongTienMotNam = tongTienNam ? tongTienNam.index : 0;

    res.render("thongke/doanh-thu", {
        ngayToNgay:0,
        ngayBatDau:"",
        ngayKetThuc:"",
        tongTienNam:tongTienMotNam,
        nam,
        cacThang: theoNam.data,
        tongTienMotNgay: tongTienMotNgay,
        tongTienMuoiNgay: tongTienMuoiNgay,
        tongTienBaMuoiNgay: tongTienBaMuoiNgay,
        admin: req.session.ten,
        msg: ""
    })
}

const thongKeDoanhThuNgayToNgay = async (req, res, next) => {
    try {
        const batDauMoi = req.query.ngayBatDau;
        const ketThucMoi = req.query.ngayKetThuc;

        req.query.ngayBatDau = moment(batDauMoi, "YYYY/MM/DD").format("DD/MM/YYYY");
        req.query.ngayKetThuc = moment(ketThucMoi, "YYYY/MM/DD").format("DD/MM/YYYY");

        const ngayToNgay = await ThongKeCtrl.thongKeDoanhThuTheoNgayToNgay(req, res); // Đợi cho hàm này hoàn thành trước khi tiếp tục
        console.log("day la thanh tienn", ngayToNgay.index);

        const nam = req.query.nam;
        const motNgay = await ThongKeCtrl.thongKeDoanhThuTheoNgay(req, res, next);
        const tongTienMotNgay = motNgay ? motNgay.tongTien : 0;
        const muoiNgay = await ThongKeCtrl.thongKeDoanhThuTheo10Ngay(req, res, next);
        const tongTienMuoiNgay = muoiNgay ? muoiNgay.tongTien : 0;
        const baMuoiNgay = await ThongKeCtrl.thongKeDoanhThuTheo30Ngay(req, res, next);
        const tongTienBaMuoiNgay = baMuoiNgay ? baMuoiNgay.tongTien : 0;

        const theoNam = await ThongKeCtrl.thongKeDoanhThuTheoThangTrongNam(req, res, next);

        const tongTienNam = await ThongKeCtrl.thongKeDoanhThuTheoNam(req, res);
        const tongTienMotNam = tongTienNam ? tongTienNam.index : 0;

        res.render("thongke/doanh-thu", {
            ngayBatDau:req.query.ngayBatDau,
            ngayKetThuc:req.query.ngayKetThuc,
            ngayToNgay: ngayToNgay.index,
            tongTienNam: tongTienMotNam,
            nam,
            cacThang: theoNam.data,
            tongTienMotNgay: tongTienMotNgay,
            tongTienMuoiNgay: tongTienMuoiNgay,
            tongTienBaMuoiNgay: tongTienBaMuoiNgay,
            admin: req.session.ten,
            msg: ""
        });
    } catch (error) {
        console.error("Error:", error);
        res.json({
            success: false,
            msg: 'Đã xảy ra lỗi khi thực hiện thống kê.'
        });
    }
};


module.exports = {
    getView,
    getChiTietDoanhThuTheoNam,
    thongKeDoanhThuNgayToNgay
}