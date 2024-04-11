//Website
var ThongKeCtrl = require("../../controllers/thongke/thong-ke-controller");

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



module.exports = {
    getView,
    getChiTietDoanhThuTheoNam
}