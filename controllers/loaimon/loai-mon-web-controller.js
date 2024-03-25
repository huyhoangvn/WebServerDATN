//Website
var LoaiMonCtrl = require("../../controllers/loaimon/loaimon-controller");
const getList =  async (req, res, next)=>{
    res.render("mon/loai-mon", {
        admin: req.session.ten,
        msg: ""
    })
}
const AddLoaiMon =  async (req, res, next)=>{
    console.log("da chay them loai mon");
    const data = themLoaiMon(req, res);
    console.log(data);
    res.render("mon/loai-mon", {
        admin: req.session.ten,
        msg: ""
    })
}

const themLoaiMon = async (req, res) =>{
    return{
        msg:"thêm thành công",
        success:true
    }
}

module.exports = {
    getList,
    AddLoaiMon
}