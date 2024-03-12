const Mon = require("../../model/Mon");
const NhanVien = require("../../model/NhanVien");
const mongo = require("mongoose");
const addmonapi = async (req, res, next) => {
  try {
    const idNhanVien = req.params.id;
    // Kiểm tra xem nhân viên có quyền quản lý không
    const item = await NhanVien.model.findById(idNhanVien);

    if (!item) {
      return res.status(404).json({ msg: "Nhân viên không tồn tại." });
    }
    if (item && item.phanQuyen === 0) {
      // Kiểm tra xem tài khoản đã tồn tại hay chưa
      const existingNhanVien = await NhanVien.model.findOne({
        idNV: req.body.idNV,
      });

      if (existingNhanVien) {
        // Nếu tài khoản đã tồn tại, trả về thông báo lỗi
        return res.status(400).json({ msg: "Tên tài khoản đã tồn tại" });
      }
    }

    // Lấy dữ liệu từ request body
    const idLM = req.body.idLM;
    const idNV = req.body.idNV;
    const idCH = req.body.idCH;
    const tenMon = req.body.tenMon;
    const giaTien = req.body.giaTien;
    const hinhAnh = "default_image.png";
    const trangThai = 1; // Đặt trạng thái là 0
    // Kiểm tra tính hợp lệ của dữ liệu
    if (!idLM || !idNV || !idCH || !tenMon || !giaTien || !hinhAnh) {
      return res.status(400).json({ msg: "Vui lòng điền đầy đủ thông tin" });
    }

    // Kiểm tra xem Món đã tồn tại hay chưa
    const index = await Mon.model.findOne({ tenMon: tenMon });
    if (index) {
      return res
        .status(400)
        .json({ msg: "Món đã tồn tại", dataSave: undefined });
    }

    // Tạo mới Món
    const saveMon = await Mon.model.create({
      idLM: idLM,
      idNV: idNV,
      idCH: idCH,
      tenMon: tenMon,
      giaTien: giaTien,
      hinhAnh:
        req.protocol + "://" + req.get("host") + "/public/images/" + hinhAnh,
      trangThai: trangThai,
    });

    // Trả về kết quả
    return res.json({
      msg: "Thêm thành công",
      dataSave: saveMon,
      success: true,
    });
  } catch (e) {
    // Xử lý lỗi
    return res.status(500).json({
      msg: "Đã xảy ra lỗi khi thêm cửa hàng",
      error: e.message,
      success: false,
    });
  }
};



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
     

       console.log( timkiem );
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
      
        console.log( list );
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
    

     console.log( timkiem );
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
    
      console.log( list );
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
   
     console.log( timkiem );
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
    
      console.log( list );
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


const updatemonapi = async (req, res) => {
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
  //Api
  addmonapi,
  getTatCaMonApi,
  deletemonapi,
  updatemonapi,
  getMonTheoid,
  getDanhSachTenCuaHang,
  kichhoatMon,
  getMonCuaCuaHang,
  getMonCuaLoaiMon,
  getTatCaMon
};
