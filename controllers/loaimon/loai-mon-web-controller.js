//Website
var LoaiMonCtrl = require("../../controllers/loaimon/loaimon-controller");
const { model: Loaimon } = require("../../model/LoaiMon");
const getList = async (req, res, next) => {
    const result = await LoaiMonCtrl.GetSoLuongMonTheoLoaiMon(req, res);
    const trang = parseInt(req.query.trang) || 1;
    const soMonTrenTrang = 10; 
    const soLuongMon = await LoaiMonCtrl.GetSoLuongLoaiMon(req, res);
    const totalPages = Math.ceil(soLuongMon.count / soMonTrenTrang);
    res.render("mon/loai-mon", {
        totalPages: totalPages,
        currentPage: trang,
        listLM: result.list,
        admin: req.session.ten,
        msg: ""
    });
}
const AddLoaiMon =  async (req, res, next)=>{
    if(req.body.tenLM == "" || req.body.tenLM == "undefined"){
        const result = await LoaiMonCtrl.GetSoLuongMonTheoLoaiMon(req, res);
        const trang = parseInt(req.query.trang) || 1;
        const soMonTrenTrang = 10; 
        const soLuongMon = await LoaiMonCtrl.GetSoLuongLoaiMon(req, res);
        const totalPages = Math.ceil(soLuongMon.count / soMonTrenTrang);
        res.render("mon/loai-mon", {
            totalPages: totalPages,
            currentPage: trang,
            listLM: result.list,
            admin: req.session.ten,
            msg: "thiếu tên loại món",
            alert: " Thêm thất bại , vui lòng nhập tên loại món",
        })
        // res.redirect("/loai-mon/danh-sach")
    }else{
        const tenLMNhap = req.body.tenLM;
        const loaiMonTim = await Loaimon.findOne({tenLM:tenLMNhap})
        if(!loaiMonTim){
            const data = await LoaiMonCtrl.themLoaiMon(req, res, next)
            const result = await LoaiMonCtrl.GetSoLuongMonTheoLoaiMon(req, res);
            const trang = parseInt(req.query.trang) || 1;
            const soMonTrenTrang = 10; 
            const soLuongMon = await LoaiMonCtrl.GetSoLuongLoaiMon(req, res);
            const totalPages = Math.ceil(soLuongMon.count / soMonTrenTrang);
            res.render("mon/loai-mon", {
                totalPages: totalPages,
                currentPage: trang,
                listLM: result.list,
                admin: req.session.ten,
                msg: data.msg,
                alert: " Thêm thành công ",
            })
        }else{
            const data = await LoaiMonCtrl.themLoaiMon(req, res, next)
            const result = await LoaiMonCtrl.GetSoLuongMonTheoLoaiMon(req, res);
            const trang = parseInt(req.query.trang) || 1;
            const soMonTrenTrang = 10; 
            const soLuongMon = await LoaiMonCtrl.GetSoLuongLoaiMon(req, res);
            const totalPages = Math.ceil(soLuongMon.count / soMonTrenTrang);
            res.render("mon/loai-mon", {
                totalPages: totalPages,
                currentPage: trang,
                listLM: result.list,
                admin: req.session.ten,
                msg: data.msg,
                alert: " Thêm thất bại, đã có loại món này ",
            })
        }

        
        // res.redirect("/loai-mon/danh-sach")
    }
}

const xoaLoaiMon =  async (req, res, next)=>{
    const xoa = await LoaiMonCtrl.deleteLoaiMonWeb(req, res);
    const result = await LoaiMonCtrl.GetSoLuongMonTheoLoaiMon(req, res);
    const trang = parseInt(req.query.trang) || 1;
    const soMonTrenTrang = 10; 
    const soLuongMon = await LoaiMonCtrl.GetSoLuongLoaiMon(req, res);
    const totalPages = Math.ceil(soLuongMon.count / soMonTrenTrang);
    console.log(xoa.msg);
    res.render("mon/loai-mon", {
        alertXoa:xoa.msg,
        alert:xoa.alert,
        listLM: result.list,
        admin: req.session.ten,
        msg: "",
        totalPages: totalPages,
        currentPage: trang,
    });
}


module.exports = {
    getList,
    AddLoaiMon,
    xoaLoaiMon
}