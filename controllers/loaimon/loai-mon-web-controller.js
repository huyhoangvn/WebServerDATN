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
        res.render("mon/loai-mon", {
            listLM: result.list,
            admin: req.session.ten,
            msg: "thiếu tên loại món"
        })
        // res.redirect("/mon/loai-mon")
    }else{
        const data = await LoaiMonCtrl.themLoaiMon(req, res, next)
        const result = await LoaiMonCtrl.GetSoLuongMonTheoLoaiMon(req, res);
        res.render("mon/loai-mon", {
            listLM: result.list,
            admin: req.session.ten,
            msg: data.msg
        })
        // res.redirect("/mon/loai-mon")
    }
}

const xoaLoaiMon =  async (req, res, next)=>{
    const xoa = await LoaiMonCtrl.deleteLoaiMonWeb(req, res);
    const result = await LoaiMonCtrl.GetSoLuongMonTheoLoaiMon(req, res);
    const trang = parseInt(req.query.trang) || 1;
    const soMonTrenTrang = 10; 
    const soLuongMon = await LoaiMonCtrl.GetSoLuongLoaiMon(req, res);
    const totalPages = Math.ceil(soLuongMon.count / soMonTrenTrang);
    res.render("mon/loai-mon", {
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