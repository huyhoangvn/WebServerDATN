//Website
var LoaiMonCtrl = require("../../controllers/loaimon/loaimon-controller");
const { model: Loaimon } = require("../../model/LoaiMon");
const getList =  async (req, res, next)=>{
    try {
        const listLM = await Loaimon.find({})
        const tenLM = req.query.tenLM;
        // const trang = parseInt( req.query.trang ) || 1;
        // const timkiem1 = {
        // };
      
        
        // if (typeof(req.query.tenLM) !== 'undefined' && req.query.tenLM !== "") {
        //   timkiem1.tenLM = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
        // }
        // const list = await Loaimon.aggregate([
        //     { $match:
        //         timkiem1,
                
        //     },
        //     {
        //         $skip: (trang-1)*10,
        //     },
        //     {
        //         $limit: 10,
        //     },
        // ]);
        res.render("mon/loai-mon", {
            listLM,
            message: 'Get đánh giá theo tên món thành công',
            admin: req.session.ten,
            msg: ""
        })
      } catch (error) {
           res.json({
            error: 'Lỗi khi lấy đánh giá theo tên món',
            success: false
        });
      }
}
const AddLoaiMon =  async (req, res, next)=>{
    if(req.body.tenLM == "" || req.body.tenLM == "undefined"){
        res.render("mon/loai-mon", {
            admin: req.session.ten,
            msg: "thiếu tên loại món"
        })
    }else{
        const data = await LoaiMonCtrl.themLoaiMon(req, res, next)
        res.render("mon/loai-mon", {
            admin: req.session.ten,
            msg: data.msg
        })
    }
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