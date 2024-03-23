const { model: DanhGia } = require("../../model/DanhGia");
const mongo = require('mongoose');


const ThemDanhGia = async function(req, res){
    const idKH = new mongo.Types.ObjectId(req.params.idKH);
    const idMon = new mongo.Types.ObjectId(req.params.idMon);
    const danhGia = req.body.danhGia;
    try {
        const daDanhGia = await DanhGia.findOne({idKH:idKH, idMon:idMon})
        if(daDanhGia){
            if(daDanhGia.trangThai !== false){
                return res.json({
                    error: 'đánh giá này đã tồn tại',
                    success: false
                });
            }else if(daDanhGia.trangThai === false){
                await DanhGia.updateOne({ idKH, idMon }, { trangThai: true });
                const index = await DanhGia.findOne({idKH:idKH, idMon:idMon});
                res.json({
                    index,
                    message: 'Thêm đánh giá lại thành công',
                    success: true
                });
            }
        }else{
            if(danhGia == ""){
                res.json({
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
                res.json({
                    index,
                    message: 'Thêm đánh giá thành công',
                    success: true
                });
            }    
        }
        
    } catch (error) {
        res.json({
            error: 'Lỗi khi thêm đánh giá',
            success: false
        });
    }
}

const SuaDanhGia = async function(req, res){
    const idDG = new mongo.Types.ObjectId(req.params.idDG);
    const danhGia = req.body.danhGia;

    try {
        const filter = {_id: idDG}
        const update = {danhGia : danhGia}
        const index = await DanhGia.findOneAndUpdate(filter, update, { new: true })

        if (!index) {
            return res.json({
                error: 'Không tìm thấy đánh giá để sửa',
                success: false
            });
        }else if(danhGia == ''){
            return res.json({
                error: 'Sửa đánh giá lỗi do thiếu đánh giá',
                success: false
            });
        }else{
            res.json({
                index,
                message: 'Sửa đánh giá thành công',
                success: true
            });
        }
    } catch (error) {
        res.json({
            error: 'Lỗi khi sửa đánh giá',
            success: false
        });
    }
    
}


const XoaDanhGia = async function(req, res){
    const idDG = new mongo.Types.ObjectId(req.params.idDG);

    try {
        const filter = {_id: idDG}
        const update = {trangThai : false}
        const index = await DanhGia.findOneAndUpdate(filter, update, { new: true })

        if (!index) {
            return res.json({
                error: 'Không tìm thấy đánh giá để xóa',
                success: false
            });
        }else{
            res.json({
                index,
                message: 'Xóa đánh giá thành công',
                success: true
            });
        }
    } catch (error) {
        res.json({
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

        res.json({
            list,
            count:list.length,
            message: 'Get đánh giá theo tên món thành công',
            success: true
        });
    } catch (error) {
        res.json({
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

        res.json({
            list,
            count:list.length,
            message: 'Get đánh giá theo tên khách hàng thành công',
            success: true
        });
    } catch (error) {
        res.json({
            error: 'Lỗi khi lấy đánh giá theo tên khách hàng',
            success: false
        });
    }
}
const GetDanhGiaTheoId = async function(req, res){
    const idDanhGia = new mongo.Types.ObjectId(req.params.idDanhGia);
    try{
        const index = await DanhGia.findOne({_id:idDanhGia});
        res.json({
            index,
            message: 'Get đánh giá theo id thành công',
            success: true
        });
    }catch (error) {
        res.json({
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
            }},
        ]);

        let danhGiaTong = 0;

        query.forEach(item => {
            danhGiaTong += item.danhGia;
        });

        const danhGiaTrungBinh = (query.length > 0 ? (danhGiaTong / query.length) : 0);

        return({
            danhGiaTrungBinh: parseFloat(danhGiaTrungBinh.toFixed(2)),
            count:query.length,
            message: 'Get số lượng đánh giá theo tên món thành công',
            success: true
        });
    } catch (error) {
        res.json({
            error: 'Lỗi khi lấy số lượng đánh giá theo tên món',
            success: false
        });
    }
}
const getTatCaDanhGiaTheoMonApi = async (req, res) => {
    const result = await GetDanhSachTheoTenMon(req, res);
    res.json(result)
}

const GetSoLuongDanhGiaTheoMonVoiFilter = async function(req, res){
    const idMon = new mongo.Types.ObjectId(req.params.idMon);
    try {
        const timkiem = {};
        if (typeof(req.query.ngayTao) !== 'undefined' && req.query.ngayTao !== "" ) {
            timkiem.ngayTao = { $regex: req.query.ngayTao, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
           }
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
                "trangThai" : "$trangThai",
                "thoiGianTao" : { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: { $add: ["$thoiGianTao", 7 * 60 * 60 * 1000] }, timezone: "Asia/Ho_Chi_Minh" } },
                "tenMon" : "$KetQuaMon.tenMon",
            }},
            {$match: 
                timkiem,
            },
        ]);
        return({
            list:query,
            message: 'Get số lượng đánh giá theo tên món thành công',
            success: true
        });
    } catch (error) {
        res.json({
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

        res.json({
            count:query.length,
            message: 'Get số lượng đánh giá theo tên khách hàng thành công',
            success: true
        });
    } catch (error) {
        res.json({
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
    GetSoLuongDanhGiaTheoKhachHang,
    getTatCaDanhGiaTheoMonApi,
    GetSoLuongDanhGiaTheoMonVoiFilter
}