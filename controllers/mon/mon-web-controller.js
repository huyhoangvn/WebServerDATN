//Website
const { model: Mon } = require("../../model/Mon");
const { model: CuaHang } = require("../../model/CuaHang");
const { model: LoaiMon } = require("../../model/LoaiMon");
const mongo = require('mongoose');


const getList =  async (req, res)=>{
    try {
        const tenMon = req.query.tenMon != "" ? "^" + req.query.tenMon : "\\w+";
        const tenCH = req.query.tenCH != "" ? "^" + req.query.tenCH : "\\w+";
        const tenLM = req.query.tenLM != "" ? "^" + req.query.tenLM : "\\w+";
        const giaTien = req.query.giaTien != -1 ? req.query.giaTien : Array.from({ length: 10000 }, (_, index) => index - 1);
        const trangThai = req.query.trangThai;

        // const tenMon = req.query.tenMon || "";
        // const tenCH = req.query.tenCH || "";
        // const tenLM = req.query.tenLM || "";
        // const giaTien = req.query.giaTien !== "-1" ? parseInt(req.query.giaTien) : -1;
        // const trangThai = req.query.trangThai !== "-1" ? JSON.parse(req.query.trangThai) : -1;

        // const query = {
        //     // Dùng $regex để kiểm tra giá trị có chứa hay không, tương tự như "LIKE" trong SQL
        //     tenMon: tenMon !== "" ? { $regex: new RegExp(tenMon, "i") } : { $exists: true },
        //     tenCH: tenCH !== "" ? { $regex: new RegExp(tenCH, "i") } : { $exists: true },
        //     tenLM: tenLM !== "" ? { $regex: new RegExp(tenLM, "i") } : { $exists: true },
        //     giaTien: giaTien !== -1 ? giaTien : { $exists: true },
        //     trangThai: trangThai !== -1 ? trangThai : { $exists: true },
        // };

        const trang = parseInt(req.query.trang) || 1;
        const soMonTrenTrang = 8; 
        const soLuongMon = await Mon.countDocuments({});
        const totalPages = Math.ceil(soLuongMon / soMonTrenTrang);

        const data1 = await Mon.find({})
        .skip((trang - 1) * soMonTrenTrang)
        .limit(soMonTrenTrang);



        const allData = [];
        for(var i = 0; i<data1.length; i++){
            const idCH = new mongo.Types.ObjectId(data1[i].idCH);
            const idLM = new mongo.Types.ObjectId(data1[i].idLM);

            const data2 = await LoaiMon.find({_id:idLM});
            const data3 = await CuaHang.find({_id:idCH});

            const monData = {
                tenMon: data1[i].tenMon,
                giaTien: data1[i].giaTien,
                trangThai: data1[i].trangThai,
                loaiMon: data2 ? data2[0].tenLM : '',
                cuaHang: data3 ? data3[0].tenCH : '', 
            };

            allData.push(monData);
        }

        res.render("mon/danh-sach", {
            data: allData,
            admin: req.session.ten,
            msg: "",
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