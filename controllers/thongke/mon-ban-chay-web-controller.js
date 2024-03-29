//Website
var ThongKeCtrl = require("../../controllers/thongke/thong-ke-controller");
const { model: LoaiMon } = require("../../model/LoaiMon");
const mongo = require('mongoose');

const getView =  async (req, res, next)=>{
    var currentMonth = new Date().getMonth() + 1;
    console.log(currentMonth);
    const idLM = new mongo.Types.ObjectId(req.query.idLM);
    const tenLM = req.query.tenLM;
    const AllLoaiMon = await LoaiMon.find({});
    let list = {}
    if(tenLM=="" || tenLM==undefined){
        const monBanChay = await ThongKeCtrl.thongKeMonBanChay10Ngay(req, res);
        list = {monBanChay} 
    }else{
        const tenLM = req.query.tenLM;
        const monBanChay = await ThongKeCtrl.thongKeMonBanChay10NgayTheoTenLoaiMon(req, res);
        list = {monBanChay}
        console.log("day la list",list.monBanChay.data);
    }
    res.render("thongke/mon-ban-chay", {
        currentMonth,
        AllLoaiMon,
        monBanChay: list.monBanChay.data,
        admin: req.session.ten,
        msg: ""
    })
}

module.exports = {
    getView
}