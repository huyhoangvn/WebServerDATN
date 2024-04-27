//Website
const { model: Mon } = require("../../model/Mon");
const { model: CuaHang } = require("../../model/CuaHang");
const { model: LoaiMon } = require("../../model/LoaiMon");
const { model: DanhGia } = require("../../model/DanhGia");
const mongo = require('mongoose');
const { getTatCaMon, getSoLuongTatCaMon, deleteMonWeb } = require("./mon-controller");
const { GetDanhSachDanhGiaTheoMonVoiFilter, GetDanhSachTheoTenMon, XoaDanhGiaWeb } = require("../danhgia/danhgia-controller");


const getList =  async (req, res)=>{
    try {
        if(req.query.giaTien === 1){
            req.query.giaTienMax = 100000
            req.query.giaTienMin = 0
        } else{
            req.query.giaTienMax = 100000
            req.query.giaTienMin = 0
        }
        const trang = parseInt(req.query.trang) || 1;
        const soMonTrenTrang = 10; 
        const soLuongMon = await getSoLuongTatCaMon(req, res);
        const totalPages = Math.ceil(soLuongMon.count / soMonTrenTrang);
        const result = await getTatCaMon(req,res);
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

const getChiTietMon = async (req, res) => {
    try {
        const idMon = new mongo.Types.ObjectId(req.params.idMon);
        const data = await Mon.findOne({_id: idMon});//tìm món theo id
        const cuaHang = await CuaHang.findOne({_id:data.idCH})//tìm cửa hàng của món
        const loaiMon = await LoaiMon.findOne({_id:data.idLM})//tìm loại món của món

        const query = await DanhGia.aggregate([// bắt đầu tính tổng và tính trung bình
            {$match: {
                idMon: idMon
            }},
            {$lookup: {
                from: "Mon",
                localField: "idMon",
                foreignField: "_id",
                as: "KetQuaMon"
            }},
            {$unwind: {
                path: "$KetQuaMon",
                preserveNullAndEmptyArrays: false
            }},
            {$project : {
                "danhGia" : "$danhGia",
                "tenMon" : "$KetQuaMon.tenMon",
            }},

        ]);
        let danhGiaTong = 0;
        query.forEach(item => {
            danhGiaTong += item.danhGia;
        });
        const danhGiaTrungBinh = (query.length > 0 ? (danhGiaTong / query.length) : 0);//kết thúc tính tổng số lượng và trung bình

        const layDanhSach = await GetDanhSachDanhGiaTheoMonVoiFilter(req, res);//đây là để lấy ra tất cả đánh giá của món

        const trang = parseInt(req.query.trang) || 1;
        const soMonTrenTrang = 10; 
        const soLuongMon = await GetDanhSachTheoTenMon(req, res);
        const totalPages = Math.ceil(soLuongMon.count / soMonTrenTrang);

        res.render("mon/chi-tiet", {
            list:layDanhSach.list,
            danhGiaTrungBinh: parseFloat(danhGiaTrungBinh.toFixed(1)),
            count:query.length,
            index:data,
            idMon:idMon,
            cuaHang:cuaHang,
            loaiMon:loaiMon,
            admin: req.session.ten,
            totalPages: totalPages,
            currentPage: trang,
        });

        //Thiếu phân trang
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
const xoaMon = async (req, res) => {
    await deleteMonWeb(req, res);
    if(req.query.giaTien === 1){
        req.query.giaTienMax = 100000
        req.query.giaTienMin = 0
    } else{
        req.query.giaTienMax = 100000
        req.query.giaTienMin = 0
    }
    const trang = parseInt(req.query.trang) || 1;
    const soMonTrenTrang = 10; 
    const soLuongMon = await getSoLuongTatCaMon(req, res);
    const totalPages = Math.ceil(soLuongMon.count / soMonTrenTrang);
    const result = await getTatCaMon(req,res);

    res.render("mon/danh-sach", {
        data: result.list,
        admin: req.session.ten,
        msg: result.list,
        totalPages: totalPages,
        currentPage: trang,
    });

}
const xoaDanhGia = async (req, res) => {
    const idDG = new mongo.Types.ObjectId(req.params.idDG) 
    const monTim = await DanhGia.findOne({_id:idDG})
    const idMon =monTim.idMon;
    await XoaDanhGiaWeb(req, res);
    res.redirect("/mon/chi-tiet/"+idMon); 
    

}



module.exports = {
    getList,
    getChiTietMon,
    xoaMon,
    xoaDanhGia
}