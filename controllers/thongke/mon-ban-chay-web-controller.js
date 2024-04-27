//Website
var ThongKeCtrl = require("../../controllers/thongke/thong-ke-controller");
const { model: LoaiMon } = require("../../model/LoaiMon");
const mongo = require('mongoose');

const getView = async (req, res, next) => {
    var currentMonth = new Date().getMonth() + 1;
    var currentYear = new Date().getFullYear();
    const AllLoaiMon = await LoaiMon.find({});
    req.query.nam = currentYear
    req.query.thang = currentMonth
    const monBanChay = await ThongKeCtrl.thongKeMonBanChay(req, res);
    res.render("thongke/mon-ban-chay", {
        currentMonth,
        currentYear,
        AllLoaiMon,
        monBanChay:monBanChay.data,
        admin: req.session.ten,
        msg: ""
    })
   
}
const getList = async (req, res, next) => {
    var currentMonth = new Date().getMonth() + 1;
    var currentYear = new Date().getFullYear();
    const idLM = new mongo.Types.ObjectId(req.query.idLM);
    const tenLM = req.query.tenLM;
    const AllLoaiMon = await LoaiMon.find({});
    let data = {}
    if (tenLM == "" || tenLM == undefined) {
        const monBanChay = await ThongKeCtrl.thongKeMonBanChay(req, res);
        data = { monBanChay }
    } else {
        const tenLM = req.query.tenLM;
        const monBanChay = await ThongKeCtrl.thongKeMonBanChayTheoTenLoaiMon(req, res);
        ldataist = { monBanChay }
    }
    res.render("thongke/mon-ban-chay", {
        currentMonth,
        currentYear,
        AllLoaiMon,
        monBanChay: data.monBanChay.list,
        admin: req.session.ten,
        msg: ""
    })

}

module.exports = {
    getView,
    getList
}