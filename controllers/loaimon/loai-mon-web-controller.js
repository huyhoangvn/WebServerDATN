//Website
var LoaiMonCtrl = require("../../controllers/loaimon/loaimon-controller");
const { model: Loaimon } = require("../../model/LoaiMon");
const getList = async (req, res, next) => {
    try {
        const timkiem = {};

        if (typeof(req.query.tenLM) !== 'undefined' && typeof(req.query.tenLM) !== "") {
            timkiem.tenLM = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
        }
        if (typeof(req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
            const trangThaiValue = parseInt(req.query.trangThai);
            if(trangThaiValue === 1 || trangThaiValue === 0){
              timkiem.trangThai = trangThaiValue === 1;
            }
           }

        const result = await Loaimon.aggregate([ 
            { $match: timkiem },
            {
                $lookup: {
                    from: "Mon",
                    localField: "_id",
                    foreignField: "idLM",
                    as: "monData"
                }
            },
            {
                $project: {
                    "idLM": "$_id",
                    "tenLM": "$tenLM",
                    "trangThai":"$trangThai",
                    "soLuongMon": { $size: "$monData" } // Đếm số lượng phần tử trong mảng "monData"
                }
            }
        ]);

        res.render("mon/loai-mon", {
            listLM: result,
            message: 'Get đánh giá theo tên món thành công',
            admin: req.session.ten,
            msg: ""
        });
    } catch (error) {
        return({
            msg: 'Lỗi khi lấy đánh giá theo tên món',
            success: false
        });
    }
}
const AddLoaiMon =  async (req, res, next)=>{
    if(req.body.tenLM == "" || req.body.tenLM == "undefined"){
        const listLM = await Loaimon.find({})
        res.render("mon/loai-mon", {
            listLM: listLoaiMon.listLM,
            admin: req.session.ten,
            msg: "thiếu tên loại món"
        })
    }else{
        const data = await LoaiMonCtrl.themLoaiMon(req, res, next)
        const listLM = await Loaimon.find({})
        res.render("mon/loai-mon", {
            listLM: listLoaiMon.listLM,
            admin: req.session.ten,
            msg: data.msg
        })
    }
}


module.exports = {
    getList,
    AddLoaiMon
}