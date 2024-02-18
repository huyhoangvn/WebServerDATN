const { model: DanhGia } = require("../../model/DanhGia");
const mongo = require('mongoose');
const { ObjectId } = require('mongodb');


const ThemDanhGia = async function(req, res){
    const idKH = new mongo.Types.ObjectId(req.params.idKH);
    const idMon = new mongo.Types.ObjectId(req.params.idMon);
    const danhGia = req.body.danhGia;
    try {
        const daDanhGia = await DanhGia.findOne({idKH:idKH, idMon:idMon})
        console.log("day la trang thai danh gia"+daDanhGia.trangThai);
        if(daDanhGia.trangThai !== false){
            return res.status(404).json({
                error: 'danh gia nay da ton tai',
                success: false
            });
        }else if(daDanhGia.trangThai === false){
            await DanhGia.updateOne({ idKH, idMon }, { trangThai: true });
            const index = await DanhGia.findOne({idKH:idKH, idMon:idMon});
            res.status(200).json({
                index,
                message: 'Thêm đánh giá lại thành công',
                success: true
            });
        }else if(danhGia == ""){
            res.status(200).json({
                error: 'Thêm đánh giá lỗi do thiếu đánh giá',
                success: false
            });
        }else{
            const index = await DanhGia.create({
                idKH: idKH,
                idMon: idMon,
                danhGia: danhGia,
                trangThai: true 
            })
            res.status(200).json({
                index,
                message: 'Thêm đánh giá thành công',
                success: true
            });
        }    
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi thêm đánh giá',
            success: false
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
        const index = await DanhGia.findOneAndUpdate(filter, update, { new: true })

        if (!data) {
            return res.status(404).json({
                error: 'Không tìm thấy đánh giá để sửa',
                success: false
            });
        }else if(danhGia == ''){
            return res.status(404).json({
                error: 'Sửa đánh giá lỗi do thiếu đánh giá',
                success: false
            });
        }else{
            res.status(200).json({
                index,
                message: 'Sửa đánh giá thành công',
                success: true
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi sửa đánh giá',
            success: false
        });
    }
    
}


const XoaDanhGia = async function(req, res){
    const idKH = new mongo.Types.ObjectId(req.params.idKH);
    const idMon = new mongo.Types.ObjectId(req.params.idMon);

    try {
        const filter = {idMon: idMon, idKH: idKH}
        const update = {trangThai : false}
        const index = await DanhGia.findOneAndUpdate(filter, update, { new: true })

        if (!data) {
            return res.status(404).json({
                error: 'Không tìm thấy đánh giá để xóa',
                success: false
            });
        }else{
            res.status(200).json({
                index,
                message: 'Xóa đánh giá thành công',
                success: true
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi xóa đánh giá',
            success: false
        });
    }
    
} 

const GetDanhSachTheoTenMon = async function(req, res){
    const idMon = new mongo.Types.ObjectId(req.params.idMon);
    const trang = parseInt(req.query.trang) || 1;
    try {
        const list = await DanhGia.aggregate([
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
            {
                $skip: (trang-1)*10,
            },
            {
                $limit: 10,
            },
        ]);

        // console.log(data);

        res.status(200).json({
            list,
            count:list.length,
            message: 'Get đánh giá theo tên món thành công',
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi lấy đánh giá theo tên món',
            success: false
        });
    }
}

const GetDanhSachTheoTenKhachHang = async function(req, res){
    const idKH = new mongo.Types.ObjectId(req.params.idKH);
    const trang = parseInt(req.query.trang) || 1;
    try {
        const list = await DanhGia.aggregate([
            {$match: {
                idKH: idKH
            }},
            {$lookup: {
                from: "KhachHang",
                localField: "idKH",
                foreignField: "_id",
                as: "KetQuaKhachHang"
            }},
            {$unwind: {
                path: "$KetQuaKhachHang",
                preserveNullAndEmptyArrays: false
            }},
            {$project : {
                "danhGia" : "$danhGia",
                "tenKH" : "$KetQuaKhachHang.tenKH",
            }},
            {
                $skip: (trang-1)*10,
            },
            {
                $limit: 10,
            },
        ]);

        // console.log(data);

        res.status(200).json({
            list,
            count:list.length,
            message: 'Get đánh giá theo tên khách hàng thành công',
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi lấy đánh giá theo tên khách hàng',
            success: false
        });
    }
}
const GetDanhGiaTheoId = async function(req, res){
    const idDanhGia = new mongo.Types.ObjectId(req.params.idDanhGia);
    try{
        const index = await DanhGia.findOne({_id:idDanhGia});
        res.status(200).json({
            index,
            message: 'Get đánh giá theo id thành công',
            success: true
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi lấy đánh giá theo id',
            success: false
        });
    }
     
}
const GetSoLuongDanhGiaTheoMon = async function(req, res){
    const idMon = new mongo.Types.ObjectId(req.params.idMon);
    try {
        const query = await DanhGia.aggregate([
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
            }}
        ])

        res.status(200).json({
            count:query.length,
            message: 'Get số lượng đánh giá theo tên món thành công',
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi lấy số lượng đánh giá theo tên món',
            success: false
        });
    }
}
const GetSoLuongDanhGiaTheoKhachHang = async function(req, res){
    const idKH = new mongo.Types.ObjectId(req.params.idKH);
    try {
        const query = await DanhGia.aggregate([
            {$match: {
                idKH: idKH
            }},
            {$lookup: {
                from: "KhachHang",
                localField: "idKH",
                foreignField: "_id",
                as: "KetQuaKhachHang"
            }},
            {$unwind: {
                path: "$KetQuaKhachHang",
                preserveNullAndEmptyArrays: false
            }},
            {$project : {
                "danhGia" : "$danhGia",
                "tenKH" : "$KetQuaKhachHang.tenKH",
            }}
        ])

        res.status(200).json({
            count:query.length,
            message: 'Get số lượng đánh giá theo tên khách hàng thành công',
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Lỗi khi lấy số lượng đánh giá theo tên khách hàng',
            success: false
        });
    }
}

module.exports = {
    ThemDanhGia,
    SuaDanhGia,
    XoaDanhGia,
    GetDanhSachTheoTenMon,
    GetDanhSachTheoTenKhachHang,
    GetDanhGiaTheoId,
    GetSoLuongDanhGiaTheoMon,
    GetSoLuongDanhGiaTheoKhachHang
}