//Website
const { model: Mon } = require("../../model/Mon");
const { model: CuaHang } = require("../../model/CuaHang");
const { model: LoaiMon } = require("../../model/LoaiMon");
const mongo = require('mongoose');
const { gettatcamonapi } = require("./mon-controller");


const getList =  async (req, res)=>{
    try {
       
        if(req.query.giaTien === 1){
            req.query.giaTienMax = 100000
            req.query.giaTienMin = 0
        } else{
            req.query.giaTienMax = 99999999
            req.query.giaTienMin = 0
        }
        const result = await gettatcamonapi(req,res);
        res.render("mon/danh-sach", {
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

module.exports = {
    getList
}