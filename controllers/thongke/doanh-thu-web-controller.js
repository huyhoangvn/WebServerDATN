//Website
var ThongKeCtrl = require("../../controllers/thongke/thong-ke-controller");

const getView =  async (req, res, next)=>{
    // var currentYear = new Date().getFullYear();
    // const nam = req.query.nam 
    const motNgay = await ThongKeCtrl.thongKeDoanhThuTheoNgay(req, res, next);
    const tongTienMotNgay = motNgay ? motNgay.tongTien : 0;
    const muoiNgay = await ThongKeCtrl.thongKeDoanhThuTheo10Ngay(req, res, next);
    const tongTienMuoiNgay = muoiNgay ? muoiNgay.tongTien : 0;
    const baMuoiNgay = await ThongKeCtrl.thongKeDoanhThuTheo30Ngay(req, res, next);
    const tongTienBaMuoiNgay = baMuoiNgay ? baMuoiNgay.tongTien : 0;
    // const tongTienNam = await ThongKeCtrl.thongKeDoanhThuTheoNam(req, res);
    // const tongTienMotNam = tongTienNam ? tongTienNam.index : 0;
    res.render("thongke/doanh-thu", {
        // nam,
        // currentYear,
        // tongTienNam:tongTienMotNam,
        tongTienMotNgay:tongTienMotNgay,
        tongTienMuoiNgay:tongTienMuoiNgay,
        tongTienBaMuoiNgay:tongTienBaMuoiNgay,
        admin: req.session.ten,
        msg: ""
    })
}

const getChiTietDoanhThuTheoNam =  async (req, res, next)=>{
    const motNgay = await ThongKeCtrl.thongKeDoanhThuTheoNgay(req, res, next);
    const tongTienMotNgay = motNgay ? motNgay.tongTien : 0;
    const muoiNgay = await ThongKeCtrl.thongKeDoanhThuTheo10Ngay(req, res, next);
    const tongTienMuoiNgay = muoiNgay ? muoiNgay.tongTien : 0;
    const baMuoiNgay = await ThongKeCtrl.thongKeDoanhThuTheo30Ngay(req, res, next);
    const tongTienBaMuoiNgay = baMuoiNgay ? baMuoiNgay.tongTien : 0;

    const theoNam = await ThongKeCtrl.thongKeDoanhThuTheoThangTrongNam(req, res, next);

    res.render("thongke/doanh-thu", {
        cacThang:theoNam.index,
        tongTienMotNgay:tongTienMotNgay,
        tongTienMuoiNgay:tongTienMuoiNgay,
        tongTienBaMuoiNgay:tongTienBaMuoiNgay,
        admin: req.session.ten,
        msg: ""
    })
}



module.exports = {
    getView,
    getChiTietDoanhThuTheoNam
}