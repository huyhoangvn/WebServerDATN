const Mon = require("../../model/Mon");
const NhanVien = require("../../model/NhanVien");
const mongo = require("mongoose");

const themMon = async (req, res, next) => {
  try {
    const idLM = new mongo.Types.ObjectId(req.body.idLM);
    const idNV = new mongo.Types.ObjectId(req.body.idNV);
    let tenMon = req.body.tenMon;
    let giaTien = req.body.giaTien;
    let hinhAnh = "default_image.png";//Ảnh mặc định trong trường hợp ảnh bị lỗi
    if(typeof(req.files.hinhAnh) != 'undefined' || typeof(req.files) != 'undefined'){
      try {
        hinhAnh = req.files.hinhAnh.map((file) => file.filename)[0]
      } catch (e) {
        //Lỗi định dạng ảnh bỏ qua luôn cũng được vì có ảnh default hoặc return báo lỗi như dưới
        return {
          msg: "Sai định dạng ảnh",
          success: false,
        };
      }
    }
    //lấy cửa hàng từ nhân viên
    const nhanVien = await NhanVien.model.findById(idNV)
    const idCH = new mongo.Types.ObjectId(nhanVien.idCH);

    //Validate đầy đủ
    if(typeof tenMon === "string" && tenMon.trim().length === 0){
      return {
        success: false, 
        msg: "Chưa nhập tên món"
      };
    }
    if(typeof giaTien === "string" && giaTien.trim().length === 0){
      let msg = "Chưa nhập giá tiền"
      //Kiểm tra giá tiền nhập lỗi định dạng sẽ bị catch ở error
      return {
        success: false, 
        msg
      }
    }

    // Tạo mới Món
    const saveMon = await Mon.model.create({
      idLM: idLM,
      idNV: idNV,
      idCH: idCH,
      tenMon: tenMon,
      giaTien: giaTien,
      hinhAnh: hinhAnh,
      trangThai: true,
    });

    // Trả về kết quả
    return {
      msg: "Thêm thành công",
      index: saveMon,
      success: true,
    };
  } catch (e) {
    //Các lỗi về định dạng object Id
    return {
      msg: e.message,
      success: false,
    };
  }
};

const kiemTraPhanQuyen = async (req, res, next) => {
  try {
    const idNV = new mongo.Types.ObjectId(req.body.idNV);
    let nhanVien = await NhanVien.model.findById(idNV)
    //Nhân viên bán hàng không thể thêm món
    if (!nhanVien || nhanVien.phanQuyen === 1 || !nhanVien.trangThai || !nhanVien.idCH){
      return {
        msg: "Người dùng không thể thêm món",
        success: false,
      }
    }
    return {
      success: true,
    }
  } catch (e) {
    //Các lỗi về định dạng object Id
    return {
      msg: e.message,
      success: false,
    };
  }
}

const themMonApi = async (req, res, next) => {
    //Kiểm tra xem có phân quyền nhân viên quản lý
    let kiemTraResult = await kiemTraPhanQuyen(req, res, next)
    if(!kiemTraResult.success){
      return res.json({
        msg: kiemTraResult.msg,
        success: false
      })
    }

    //Thêm món
    let themResult = await themMon(req, res, next)
    if(!themResult.success){
      return res.json({
        msg: themResult.msg,
        success: false
      })
    }

    //Thành công
    return res.json({
      index: themResult.index,
      msg: themResult.msg,
      success: true
    })
}

const deletemonapi = async (req, res) => {
  try {
    // Lấy id từ params
    const idMon = req.params.idMon;
    // Tìm kiếm nhân viên dựa trên id và cập nhật trạng thái thành 0
    const updatedNhanVien = await Mon.model.findOneAndUpdate(
      { _id: idMon },
      { $set: { trangThai: 0 } },
      { new: true } // Trả về bản ghi đã được cập nhật
    );
    // Kiểm tra nếu không tìm thấy nhân viên
    if (!updatedNhanVien) {
      return res.status(404).json({ error: "Không tìm thấy nhân viên" });
    }
    res.status(200).json({
      msg: "Đã cập nhật trạng thái thành công",
      data: updatedNhanVien,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      error: e.message || "Đã xảy ra lỗi khi cập nhật trạng thái nhân viên",
    });
  }
};

const getTatCaMon = async (req, res) => {
    try {

      const trangThai = req.params.trangThai;
      const trang = parseInt( req.query.trang ) || 1;
      const timkiem = {

      };
      let giaTienMin = 0;
      let giaTienMax = 100000;
       if (typeof(req.query.tenMon) !== 'undefined' && req.query.tenMon !== "" ) {
        timkiem.tenMon = { $regex: req.query.tenMon, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
       }
       if (typeof(req.query.tenCH) !== 'undefined' && req.query.tenCH !== "" ) {
        timkiem["KetQuaCuaHang.tenCH"] = { $regex: req.query.tenCH, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
       }
       if (typeof(req.query.tenLM) !== 'undefined' && req.query.tenLM !== "" ) {
        timkiem["KetQuaCuaHang.tenLM"] = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
       }
       if (typeof(req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
        const trangThaiValue = parseInt(req.query.trangThai);
        if(trangThaiValue === 1 || trangThaiValue === 0){
          timkiem.trangThai = trangThaiValue === 1;
        }
       }
       if (typeof(req.query.giaTienMin) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMin))) {
        giaTienMin = parseInt(req.query.giaTienMin); 

       }
       if (typeof(req.query.giaTienMax) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMax))) {
        giaTienMax = parseInt(req.query.giaTienMax); 

       }
     

        const list = await Mon.model.aggregate([
           {$lookup: {
                from: "CuaHang",
                localField: "idCH",
                foreignField: "_id",
                as: "KetQuaCuaHang"
            }},
            {$lookup: {
              from: "LoaiMon",
              localField: "idLM",
              foreignField: "_id",
              as: "KetQuaLoaiMon"
            }},
            {$match: 
              timkiem,
            },
           
            {$unwind: {
                path: "$KetQuaCuaHang",
                preserveNullAndEmptyArrays: false
            }},
            {$unwind: {
              path: "$KetQuaLoaiMon",
              preserveNullAndEmptyArrays: false
            }},
            {$project : {
                "tenMon":  "$tenMon",
                "giaTien": "$giaTien",
                "trangThai" : "$trangThai",
                "tenCH": "$KetQuaCuaHang.tenCH", // Thay vì "$tenCH"
                "tenLM": "$KetQuaLoaiMon.tenLM", 
                "idMon": "$_id",
            }},
            {
              $match: {
                giaTien: {
                   $gte: giaTienMin,
                   $lte: giaTienMax
                   }
              }
            },
            {
              $skip: (trang-1)*10,
            },
            {
              $limit: 10,
            },
        ])
      
        return {
            count:list.length,
            list:list,
            message: 'Get số lượng đánh giá theo tên khách hàng thành công',
            success: true,
            
        };
    } catch (error) {
        console.error(error);
        return {
            error: 'Lỗi khi lấy số lượng đánh giá theo tên khách hàng',
            success: false
        };
    }
};

const getSoLuongTatCaMon = async (req, res) => {
  try {

    const trangThai = req.params.trangThai;
    const trang = parseInt( req.query.trang ) || 1;
    const timkiem = {

    };
    let giaTienMin = 0;
    let giaTienMax = 100000;
     if (typeof(req.query.tenMon) !== 'undefined' && req.query.tenMon !== "" ) {
      timkiem.tenMon = { $regex: req.query.tenMon, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
     }
     if (typeof(req.query.tenCH) !== 'undefined' && req.query.tenCH !== "" ) {
      timkiem["KetQuaCuaHang.tenCH"] = { $regex: req.query.tenCH, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
     }
     if (typeof(req.query.tenLM) !== 'undefined' && req.query.tenLM !== "" ) {
      timkiem["KetQuaCuaHang.tenLM"] = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
     }
     if (typeof(req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if(trangThaiValue === 1 || trangThaiValue === 0){
        timkiem.trangThai = trangThaiValue === 1;
      }
     }
     if (typeof(req.query.giaTienMin) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMin))) {
      giaTienMin = parseInt(req.query.giaTienMin); 

     }
     if (typeof(req.query.giaTienMax) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMax))) {
      giaTienMax = parseInt(req.query.giaTienMax); 

     }
   
    const result = await Mon.model.aggregate([
         {$lookup: {
              from: "CuaHang",
              localField: "idCH",
              foreignField: "_id",
              as: "KetQuaCuaHang"
          }},
          {$lookup: {
            from: "LoaiMon",
            localField: "idLM",
            foreignField: "_id",
            as: "KetQuaLoaiMon"
          }},
          {$match: 
            timkiem,
          },
          {$unwind: {
              path: "$KetQuaCuaHang",
              preserveNullAndEmptyArrays: false
          }},
          {$unwind: {
            path: "$KetQuaLoaiMon",
            preserveNullAndEmptyArrays: false
          }},
          {
            $match: {
              giaTien: {
                 $gte: giaTienMin,
                 $lte: giaTienMax
                 }
            }
          },
          {
            $count: "count",
          }
      ])
      return {
          count: result[0].count,
          success: true,
          msg: "Thành công"
      };
  } catch (error) {
      console.error(error);
      return {
          error: 'Lỗi khi lấy số lượng',
          success: false
      };
  }
};

const getTatCaMonApi = async (req, res) => {
  const result = await getTatCaMon(req, res);
  res.json(result)
}

const getMonCuaCuaHang = async (req, res) => {
  try {
 
    const idCH = new mongo.Types.ObjectId(req.params.idCH);    
   
    const trangThai = req.params.trangThai;
    const trang = parseInt( req.query.trang ) || 1;
    const timkiem = {

    };
    let giaTienMin = 0;
    let giaTienMax = 100000;
     if (typeof(req.query.tenMon) !== 'undefined' && req.query.tenMon !== "" ) {
      timkiem.tenMon = { $regex: req.query.tenMon, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
     }
     if (typeof(req.query.tenCH) !== 'undefined' && req.query.tenCH !== "" ) {
      timkiem["KetQuaCuaHang.tenCH"] = { $regex: req.query.tenCH, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
     }
     if (typeof(req.query.tenLM) !== 'undefined' && req.query.tenLM !== "" ) {
      timkiem["KetQuaCuaHang.tenLM"] = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
     }
     if (typeof(req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if(trangThaiValue === 1 || trangThaiValue === 0){
        timkiem.trangThai = trangThaiValue === 1;
      }
     }
     if (typeof(req.query.giaTienMin) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMin))) {
      giaTienMin = parseInt(req.query.giaTienMin); 

     }
     if (typeof(req.query.giaTienMax) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMax))) {
      giaTienMax = parseInt(req.query.giaTienMax); 

     }
    

      const list = await Mon.model.aggregate([
         {$lookup: {
              from: "CuaHang",
              localField: "idCH",
              foreignField: "_id",
              as: "KetQuaCuaHang"
          }},
          {$lookup: {
            from: "LoaiMon",
            localField: "idLM",
            foreignField: "_id",
            as: "KetQuaLoaiMon"
          }},
          {$match: {
            idCH: idCH       
          }},
          {$match: 
            timkiem,
          },
          
          {$unwind: {
              path: "$KetQuaCuaHang",
              preserveNullAndEmptyArrays: false
          }},
          {$unwind: {
            path: "$KetQuaLoaiMon",
            preserveNullAndEmptyArrays: false
          }},
          {$project : {
            "tenMon":  "$tenMon",
            "giaTien": "$giaTien",
            "trangThai" : "$trangThai",
            "tenCH": "$KetQuaCuaHang.tenCH", // Thay vì "$tenCH"
            "tenLM": "$KetQuaLoaiMon.tenLM", 
            "idMon": "$idMON",
          }},
          {
            $match: {
              giaTien: {
                 $gte: giaTienMin,
                 $lte: giaTienMax
                 }
            }
          },
          {
            $skip: (trang-1)*10,
          },
          {
            $limit: 10,
          },
      ])
    
      res.status(200).json({
          count:list.length,
          list:list,
          message: 'Get số lượng đánh giá theo tên khách hàng thành công',
          success: true,
          
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'Lỗi khi lấy số lượng đánh giá theo tên khách hàng',
          success: false
      });
  }
};

const getMonCuaLoaiMon = async (req, res) => {
  try {
 
    const idLM = new mongo.Types.ObjectId(req.params.idLM);
   
    const trangThai = req.params.trangThai;
    const trang = parseInt( req.query.trang ) || 1;
    const timkiem = {

    };
    let giaTienMin = 0;
    let giaTienMax = 100000;
     if (typeof(req.query.tenMon) !== 'undefined' && req.query.tenMon !== "" ) {
      timkiem.tenMon = { $regex: req.query.tenMon, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
     }
     if (typeof(req.query.tenCH) !== 'undefined' && req.query.tenCH !== "" ) {
      timkiem["KetQuaCuaHang.tenCH"] = { $regex: req.query.tenCH, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
     }
     if (typeof(req.query.tenLM) !== 'undefined' && req.query.tenLM !== "" ) {
      timkiem["KetQuaCuaHang.tenLM"] = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
     }
     if (typeof(req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if(trangThaiValue === 1 || trangThaiValue === 0){
        timkiem.trangThai = trangThaiValue === 1;
      }
     }
     if (typeof(req.query.giaTienMin) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMin))) {
      giaTienMin = parseInt(req.query.giaTienMin); 

     }
     if (typeof(req.query.giaTienMax) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMax))) {
      giaTienMax = parseInt(req.query.giaTienMax); 

     }
   
      const list = await Mon.model.aggregate([
         {$lookup: {
              from: "CuaHang",
              localField: "idCH",
              foreignField: "_id",
              as: "KetQuaCuaHang"
          }},
          {$lookup: {
            from: "LoaiMon",
            localField: "idLM",
            foreignField: "_id",
            as: "KetQuaLoaiMon"
          }},
          {$match: {
            idLM: idLM,      
          }},
          {$match: 
            timkiem,
          },
          
          {$unwind: {
              path: "$KetQuaCuaHang",
              preserveNullAndEmptyArrays: false
          }},
          {$unwind: {
            path: "$KetQuaLoaiMon",
            preserveNullAndEmptyArrays: false
          }},
          {$project : {
            "tenMon":  "$tenMon",
            "giaTien": "$giaTien",
            "trangThai" : "$trangThai",
            "tenCH": "$KetQuaCuaHang.tenCH", // Thay vì "$tenCH"
            "tenLM": "$KetQuaLoaiMon.tenLM", 
            "idMon": "$idMON",
          }},
          {
            $match: {
              giaTien: {
                 $gte: giaTienMin,
                 $lte: giaTienMax
                 }
            }
          },
          {
            $skip: (trang-1)*10,
          },
          {
            $limit: 10,
          },
      ])
    
      res.status(200).json({
          count:list.length,
          list:list,
          message: 'Get số lượng đánh giá theo tên khách hàng thành công',
          success: true,
          
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'Lỗi khi lấy số lượng đánh giá theo tên khách hàng',
          success: false
      });
  }
};


const  updatemonapi = async (req, res) => {
  const idNV = new mongo.Types.ObjectId(req.params.idNV);
  const idCH = new mongo.Types.ObjectId(req.params.idCH);
  const tenMon = req.body.tenMon;
  const giaTien = req.body.giaTien;

  try {
    const filter = { idNV: idNV, idCH: idCH };
    const update = { tenMon: tenMon, giaTien: giaTien };
    const index = await Mon.model.findOneAndUpdate(filter, update, {
      new: true,
    });
    // if (!index) {
    //   return res.status(404).json({
    //     error: "Không tìm thấy món để sửa",
    //     success: false,
    //   });
    // }

    // // Check if the user belongs to the same store as the item being updated
    // if (index.idCH !== idNV) {
    //   return res.status(403).json({
    //     error: "Bạn không có quyền sửa món này.",
    //     success: false,
    //   });
    // }

    // // Check if the user has management permission
    // if (index.phanQuyen !== 1) {
    //   // Assuming 1 is the management permission level
    //   return res.status(403).json({
    //     error: "Bạn không có quyền quản lý để thực hiện thao tác này.",
    //     success: false,
    //   });
    // }
    if (!index) {
      return res.status(404).json({
        error: "Không tìm thấy món để sửa",
        success: false,
      });
    } else if (tenMon == "" || giaTien == "") {
      return res.status(404).json({
        error: "Sửa món lỗi do thiếu thông tin",
        success: false,
      });
    } else {
      res.status(200).json({
        index,
        message: "Sửa món thành công",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Lỗi khi sửa món",
      success: false,
    });
  }
};

// Hiển thị chi tiết món với id cụ thể

const getMonTheoid = async (req, res) => {
  const idMon = new mongo.Types.ObjectId(req.params.idMon);
  try {
    const index = await Mon.model.findOne({ _id: idMon });
    res.status(200).json({
      index,
      message: "Get đánh giá theo id thành công",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Lỗi khi lấy đánh giá theo id",
      success: false,
    });
  }
};

//Cải thiện hiển thị danh sách để tìm kiếm món theo tên cửa hàng
const getDanhSachTenCuaHang = async (req, res, next) => {
 
};
//
const getDanhSachTenLoaiMon = async (req, res, next) => {};

// khich hoat mon
const kichhoatMon = async (req, res, next) => {
  try {
    // const idNguoiSua = req.user.id; 
    // const idCH = req.user.idCH; 

    // const item = await Mon.model.findById(id);

    // // Check if the food item exists
    // if (!item) {
    //     return res.status(404).json({ error: "Không tìm thấy món" });
    // }

    // // Check if the user belongs to the same store as the food item
    // if (item.idCH !== idNguoiSua) {
    //     return res.status(403).json({ error: "Bạn không có quyền kích hoạt món này" });
    // }

    // // Check if the user has management permissions (e.g., phanQuyen === 1)
    // // Adjust the condition according to your permission structure
    // if (req.user.phanQuyen !== 0) {
    //     return res.status(403).json({ error: "Bạn không có quyền quản lý để kích hoạt món này" });
    // }

    const id = req.params.id;
    const kichhoat = await Mon.model.findOneAndUpdate(
      { _id: id },
      { $set: { trangThai: true } },
      { new: true }
    );
    if (!kichhoat) {
      return res.status(404).json({ error: "Không tìm thấy loại món" });
    }
    res.status(200).json({
      msg: "đã kích hoạt cửa hàng",
      data: kichhoat,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false,message: "Lỗi kích hoạt món", error: error });
  }
};
module.exports = {
  //Module
  kiemTraPhanQuyen,
  themMon,
  //Api
  themMonApi,

  getTatCaMonApi,
  deletemonapi,
  updatemonapi,
  getMonTheoid,
  getDanhSachTenCuaHang,
  kichhoatMon,
  getMonCuaCuaHang,
  getMonCuaLoaiMon,
  getTatCaMon,
  getSoLuongTatCaMon
};
