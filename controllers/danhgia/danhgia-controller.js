const { model: DanhGia } = require("../../model/DanhGia");
const mongo = require('mongoose');
const { ObjectId } = require('mongodb');


const ThemDanhGia = async function(req, res){
    const idKH = new mongo.Types.ObjectId(req.params.idKH);
    const idMon = new mongo.Types.ObjectId(req.params.idMon);
    const danhGia = req.body.danhGia;
    try {
        if(danhGia == ""){
            res.status(200).json({
                message: 'Thêm đánh giá lỗi do thiếu đánh giá'
            });
        }else{
            const data = await DanhGia.create({
                idKH: idKH,
                idMon: idMon,
                danhGia: danhGia,
                trangThai: true 
            })
            res.status(200).json({
                data,
                message: 'Thêm đánh giá thành công'
            });
        }    
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Lỗi khi thêm đánh giá'
        });
    }
}

const SuaDanhGia = async function(req, res){
    const idKH = new mongo.Types.ObjectId(req.params.idKH);
    const idMon = new mongo.Types.ObjectId(req.params.idMon);
    const danhGia = req.body.danhGia;

    try {
        const filter = {idMon: idMon, idKH: idKH}
        const update = {danhGia : danhGia}
        const data = await DanhGia.findOneAndUpdate(filter, update, { new: true })

        if (!data) {
            return res.status(404).json({
                message: 'Không tìm thấy đánh giá để sửa'
            });
        }else if(danhGia == ''){
            return res.status(404).json({
                message: 'Sửa đánh giá lỗi do thiếu đánh giá'
            });
        }else{
            res.status(200).json({
                data,
                message: 'Sửa đánh giá thành công'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Lỗi khi sửa đánh giá'
        });
    }
    
}


const XoaDanhGia = async function(req, res){
    const idKH = new mongo.Types.ObjectId(req.params.idKH);
    const idMon = new mongo.Types.ObjectId(req.params.idMon);

    try {
        const filter = {idMon: idMon, idKH: idKH}
        const update = {trangThai : false}
        const data = await DanhGia.findOneAndUpdate(filter, update, { new: true })

        if (!data) {
            return res.status(404).json({
                message: 'Không tìm thấy đánh giá để xóa'
            });
        }else{
            res.status(200).json({
                data,
                message: 'Xóa đánh giá thành công'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Lỗi khi Xóa đánh giá'
        });
    }
    
}

module.exports = {
    ThemDanhGia,
    SuaDanhGia,
    XoaDanhGia
}