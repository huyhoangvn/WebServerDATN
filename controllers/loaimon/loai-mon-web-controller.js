//Website
var LoaiMonCtrl = require("../../controllers/loaimon/loaimon-controller");
const { model: Loaimon } = require("../../model/LoaiMon");
const getList = async (req, res, next) => {
    const result = await LoaiMonCtrl.GetSoLuongMonTheoLoaiMon(req, res);
    res.render("mon/loai-mon", {
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


module.exports = {
    getList,
    AddLoaiMon
}