const Mon = require("../../model/Mon");
const NhanVien = require("../../model/NhanVien");
const LoaiMon = require("../../model/LoaiMon");
const CuaHang = require("../../model/CuaHang");
const mongo = require("mongoose");
var DanhGiaCtrl = require("../../controllers/danhgia/danhgia-controller");

const themMon = async (req, res, next) => {
  try {
    const idLM = new mongo.Types.ObjectId(req.body.idLM);
    const idNV = new mongo.Types.ObjectId(req.body.idNV);
    let tenMon = req.body.tenMon;
    let giaTien = req.body.giaTien;
    let trangThai = req.body.trangThai;
    let hinhAnh = "default_image.png";//Ảnh mặc định trong trường hợp ảnh bị lỗi
    if (typeof (req.files.hinhAnh) != 'undefined' || typeof (req.files) != 'undefined') {
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
    if (req.body.tenMon.length > 100) {
      return res.json({ msg: "tên món vượt quá số lượng ký tự cho phép", success: false });
    }
    //lấy cửa hàng từ nhân viên
    const nhanVien = await NhanVien.model.findById(idNV)
    const idCH = new mongo.Types.ObjectId(nhanVien.idCH);

    //Validate đầy đủ
    if (typeof tenMon === "string" && tenMon.trim().length === 0) {
      return {
        success: false,
        msg: "Chưa nhập tên món"
      };
    }
    if (typeof giaTien === "string" && giaTien.trim().length === 0) {
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
      trangThai: trangThai,
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
      msg: e.msg,
      success: false,
    };
  }
};

const kiemTraPhanQuyen = async (req, res, next) => {
  try {
    const idNV = new mongo.Types.ObjectId(req.body.idNV);
    let nhanVien = await NhanVien.model.findById(idNV)
    //Nhân viên bán hàng không thể thêm món
    if (!nhanVien || nhanVien.phanQuyen === 1 || !nhanVien.trangThai || !nhanVien.idCH) {
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
      msg: e.msg,
      success: false,
    };
  }
}

const themMonApi = async (req, res, next) => {
  //Kiểm tra xem có phân quyền nhân viên quản lý
  let kiemTraResult = await kiemTraPhanQuyen(req, res, next)
  if (!kiemTraResult.success) {
    return res.json({
      msg: kiemTraResult.msg,
      success: false
    })
  }

  //Thêm món
  let themResult = await themMon(req, res, next)
  if (!themResult.success) {
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
      return res.json({ msg: "Không tìm thấy nhân viên", success: false });
    }
    res.json({
      msg: "Đã cập nhật trạng thái thành công",
      data: updatedNhanVien,
    });
  } catch (e) {
    res.json({
      success: false,
      msg: e.msg || "Đã xảy ra lỗi khi cập nhật trạng thái nhân viên",
    });
  }
};
const deleteMonWeb = async (req, res) => {
  try {
    const idMon = new mongo.Types.ObjectId(req.params.idMon)
    const filter = { _id: idMon }
    const monTim = await Mon.model.findOne({ _id: idMon })
    let monSua = {}
    if (monTim.trangThai == true) {
      const update = { trangThai: false }
      const data = await Mon.model.findOneAndUpdate(filter, update, { new: true })
      monSua = data
    } else {
      const update = { trangThai: true }
      const data = await Mon.model.findOneAndUpdate(filter, update, { new: true })
      monSua = data
    }

    if (!monSua) {
      return ({ error: "Xóa món thất bại !", success: false, msg: "Đổi trạng thái thất bại !" }); // Phản hồi 404 nếu không tìm thấy món
    } else {
      return ({ message: "Xóa món thành công !", success: true, msg: "Đổi trạng thái thành công !" }); // Phản hồi 200 nếu thành công
    }
  } catch (err) {
    return ({ msg: err.msg }); // Phản hồi 500 nếu có lỗi xảy ra
  }
}

const getTatCaMon = async (req, res) => {
  try {

    const trang = parseInt(req.query.trang) || 1;
    const timkiem = {

    };
    let giaTienMin = 0;
    let giaTienMax = 10000000;
    if (typeof (req.query.tenMon) !== 'undefined' && req.query.tenMon !== "") {
      timkiem.tenMon = { $regex: req.query.tenMon, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof (req.query.tenCH) !== 'undefined' && req.query.tenCH !== "") {
      timkiem["KetQuaCuaHang.tenCH"] = { $regex: req.query.tenCH, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof (req.query.tenLM) !== 'undefined' && req.query.tenLM !== "") {
      timkiem["KetQuaLoaiMon.tenLM"] = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if (trangThaiValue === 1 || trangThaiValue === 0) {
        timkiem.trangThai = trangThaiValue === 1;
      }
    }
    if (typeof (req.query.giaTienMin) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMin))) {
      giaTienMin = parseInt(req.query.giaTienMin);

    }
    if (typeof (req.query.giaTienMax) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMax))) {
      giaTienMax = parseInt(req.query.giaTienMax);

    }
    const totalMon = await Mon.model.countDocuments(timkiem);
    const totalPages = Math.ceil(totalMon / 10);


    const list = await Mon.model.aggregate([
      {
        $lookup: {
          from: "CuaHang",
          localField: "idCH",
          foreignField: "_id",
          as: "KetQuaCuaHang"
        }
      },
      {
        $lookup: {
          from: "LoaiMon",
          localField: "idLM",
          foreignField: "_id",
          as: "KetQuaLoaiMon"
        }
      },
      {
        $match:
          timkiem,
      },

      {
        $unwind: {
          path: "$KetQuaCuaHang",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $unwind: {
          path: "$KetQuaLoaiMon",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          "tenMon": "$tenMon",
          "giaTien": "$giaTien",
          "trangThai": "$trangThai",
          "tenCH": "$KetQuaCuaHang.tenCH", // Thay vì "$tenCH"
          "tenLM": "$KetQuaLoaiMon.tenLM",
          "idMon": "$_id",
          "hinhAnh": {
            $concat: [
              req.protocol + "://",
              req.get("host"),
              "/public/images/",
              "$hinhAnh"
            ]
          },

        }
      },
      {
        $match: {
          giaTien: {
            $gte: giaTienMin,
            $lte: giaTienMax
          }
        }
      },
      {
        $skip: (trang - 1) * 10,
      },
      {
        $limit: 10,
      },
    ])

    return {
      count: list.length,
      list: list,
      currentPage: trang,
      totalPage: totalPages,
      msg: 'Get tất cả món thành công',
      success: true,

    };
  } catch (error) {
    return {
      msg: 'Lỗi khi lấy tất cả món',
      success: false
    };
  }
};

const getSoLuongTatCaMon = async (req, res) => {
  try {

    const trangThai = req.params.trangThai;
    const trang = parseInt(req.query.trang) || 1;
    const timkiem = {

    };
    let giaTienMin = 0;
    let giaTienMax = 100000;
    if (typeof (req.query.tenMon) !== 'undefined' && req.query.tenMon !== "") {
      timkiem.tenMon = { $regex: req.query.tenMon, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof (req.query.tenCH) !== 'undefined' && req.query.tenCH !== "") {
      timkiem["KetQuaCuaHang.tenCH"] = { $regex: req.query.tenCH, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof (req.query.tenLM) !== 'undefined' && req.query.tenLM !== "") {
      timkiem["KetQuaCuaHang.tenLM"] = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if (trangThaiValue === 1 || trangThaiValue === 0) {
        timkiem.trangThai = trangThaiValue === 1;
      }
    }
    if (typeof (req.query.giaTienMin) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMin))) {
      giaTienMin = parseInt(req.query.giaTienMin);

    }
    if (typeof (req.query.giaTienMax) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMax))) {
      giaTienMax = parseInt(req.query.giaTienMax);

    }

    const result = await Mon.model.aggregate([
      {
        $lookup: {
          from: "CuaHang",
          localField: "idCH",
          foreignField: "_id",
          as: "KetQuaCuaHang"
        }
      },
      {
        $lookup: {
          from: "LoaiMon",
          localField: "idLM",
          foreignField: "_id",
          as: "KetQuaLoaiMon"
        }
      },
      {
        $match:
          timkiem,
      },
      {
        $unwind: {
          path: "$KetQuaCuaHang",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $unwind: {
          path: "$KetQuaLoaiMon",
          preserveNullAndEmptyArrays: false
        }
      },
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

    return {
      msg: 'Lỗi khi lấy số lượng',
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
    const trang = parseInt(req.query.trang) || 1;
    const timkiem = {

    };
    let giaTienMin = 0;
    let giaTienMax = 100000;
    if (typeof (req.query.tenMon) !== 'undefined' && req.query.tenMon !== "") {
      timkiem.tenMon = { $regex: req.query.tenMon, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof (req.query.tenCH) !== 'undefined' && req.query.tenCH !== "") {
      timkiem["KetQuaCuaHang.tenCH"] = { $regex: req.query.tenCH, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof (req.query.tenLM) !== 'undefined' && req.query.tenLM !== "") {
      timkiem["KetQuaLoaiMon.tenLM"] = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if (trangThaiValue === 1 || trangThaiValue === 0) {
        timkiem.trangThai = trangThaiValue === 1;
      }
    }
    if (typeof (req.query.giaTienMin) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMin))) {
      giaTienMin = parseInt(req.query.giaTienMin);

    }
    if (typeof (req.query.giaTienMax) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMax))) {
      giaTienMax = parseInt(req.query.giaTienMax);

    }


    const list = await Mon.model.aggregate([
      {
        $lookup: {
          from: "CuaHang",
          localField: "idCH",
          foreignField: "_id",
          as: "KetQuaCuaHang"
        }
      },
      {
        $lookup: {
          from: "LoaiMon",
          localField: "idLM",
          foreignField: "_id",
          as: "KetQuaLoaiMon"
        }
      },
      {
        $match: {
          idCH: idCH
        }
      },
      {
        $match:
          timkiem,
      },

      {
        $unwind: {
          path: "$KetQuaCuaHang",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $unwind: {
          path: "$KetQuaLoaiMon",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          "tenMon": "$tenMon",
          "giaTien": "$giaTien",
          "trangThai": "$trangThai",
          "tenCH": "$KetQuaCuaHang.tenCH", // Thay vì "$tenCH"
          "tenLM": "$KetQuaLoaiMon.tenLM",
          "idMon": "$idMON",
          "hinhAnh": {
            $concat: [
              req.protocol + "://",
              req.get("host"),
              "/public/images/",
              "$hinhAnh"
            ]
          },
        }
      },
      {
        $match: {
          giaTien: {
            $gte: giaTienMin,
            $lte: giaTienMax
          }
        }
      },
      {
        $skip: (trang - 1) * 10,
      },
      {
        $limit: 10,
      },
    ])

    res.json({
      count: list.length,
      list: list,
      msg: 'Get món của cửa hàng thành công',
      success: true,

    });
  } catch (error) {

    res.json({
      msg: 'Lỗi khi lấy món của cửa hàng',
      success: false
    });
  }
};

const getMonCuaLoaiMon = async (req, res) => {
  try {
    const trangThai = req.params.trangThai;
    const trang = parseInt(req.query.trang) || 1;

    const tatCaLM = await LoaiMon.model.find({})
    let idLM = null;
    const timkiem = {

    };
    let giaTienMin = 0;
    let giaTienMax = 100000;
    if (typeof (req.query.tenMon) !== 'undefined' && req.query.tenMon !== "") {
      timkiem.tenMon = { $regex: req.query.tenMon, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof (req.query.tenCH) !== 'undefined' && req.query.tenCH !== "") {
      timkiem["KetQuaCuaHang.tenCH"] = { $regex: req.query.tenCH, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    // if (typeof (req.query.tenLM) !== 'undefined' && req.query.tenLM !== "") {
    //   timkiem["KetQuaCuaHang.tenLM"] = { $regex: req.query.tenLM, $options: 'i' };
    // } // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if (trangThaiValue === 1 || trangThaiValue === 0) {
        timkiem.trangThai = trangThaiValue === 1;
      }
    }
    if (typeof (req.query.giaTienMin) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMin))) {
      giaTienMin = parseInt(req.query.giaTienMin);

    }
    if (typeof (req.query.giaTienMax) !== 'undefined' && !isNaN(parseInt(req.query.giaTienMax))) {
      giaTienMax = parseInt(req.query.giaTienMax);

    }

    if (typeof (req.query.indexLM) !== 'undefined' && !isNaN(parseInt(req.query.indexLM))) {
      indexLM = parseInt(req.query.indexLM);
      for (let i = 0; i < tatCaLM.length; i++) {
        if (indexLM === i) {
          idLM = tatCaLM[i]._id;
        }
      }

    }

    const list = await Mon.model.aggregate([
      {
        $lookup: {
          from: "CuaHang",
          localField: "idCH",
          foreignField: "_id",
          as: "KetQuaCuaHang"
        }
      },
      {
        $lookup: {
          from: "LoaiMon",
          localField: "idLM",
          foreignField: "_id",
          as: "KetQuaLoaiMon"
        }
      },
      {
        $match: {
          idLM: idLM,
          trangThai: true
        }
      },
      {
        $match:
          timkiem,
      },

      {
        $unwind: {
          path: "$KetQuaCuaHang",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $unwind: {
          path: "$KetQuaLoaiMon",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          "tenMon": "$tenMon",
          "giaTien": "$giaTien",
          "trangThai": "$trangThai",
          "tenCH": "$KetQuaCuaHang.tenCH", // Thay vì "$tenCH"
          "tenLM": "$KetQuaLoaiMon.tenLM",
          "hinhAnh": { $concat: [req.protocol, "://", req.get("host"), "/public/images/", "$hinhAnh"] },
          "idMon": "$_id",
        }
      },
      {
        $match: {
          giaTien: {
            $gte: giaTienMin,
            $lte: giaTienMax
          }
        }
      },
      {
        $skip: (trang - 1) * 10,
      },
      {
        $limit: 10,
      },
    ])
    let tenLM = ""; // Khởi tạo giá trị mặc định cho tenLM
    if (idLM) {
      const loaiMon = await LoaiMon.model.findOne({ _id: idLM });
      if (loaiMon) {
        tenLM = loaiMon.tenLM;
      }
    }

    res.json({
      count: list.length,
      list: list,
      tenLM: tenLM,
      msg: 'Get món của loại món thành công',
      success: true,

    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      success: false
    });
  }
};


const updatemon = async (req, res) => {
  try {
    const idMon = new mongo.Types.ObjectId(req.params.idMon);
    const idNV = new mongo.Types.ObjectId(req.body.idNV);
    const monCu = await Mon.model.findOne({ _id: idMon });
    const nhanVienSua = await NhanVien.model.findOne({ _id: idNV });

    if (monCu == null) {
      return ({
        error: "Không tìm thấy món để sửa",
        success: false,
      });
    }
    // validate nhân viên 
    if (nhanVienSua.trangThai != true) {
      return ({
        msg: "Nhân viên không hoạt động",
        success: false
      })
    }
    if (nhanVienSua.idCH === monCu.idCH) {
      return ({
        msg: "món khác cửa hàng với nhân viên đang sửa",
        success: false
      })
    }
    if (nhanVienSua.phanQuyen != 0) {
      return ({
        msg: "nhân viên sửa không phải nhâ viên quản lý",
        success: false
      })
    }
    if (idNV === "" || idNV === undefined) {
      return ({
        msg: "thiếu idNV",
        success: false
      })
    }




    let updateFields = {};

    // Kiểm tra từng trường và thêm vào object updateFields nếu tồn tại giá trị
    if (req.body.tenMon !== undefined) {
      updateFields.tenMon = req.body.tenMon;
    }
    if (req.body.giaTien !== undefined) {
      updateFields.giaTien = req.body.giaTien;
    }
    if (req.body.idLM !== undefined) {
      updateFields.idLM = new mongo.Types.ObjectId(req.body.idLM);
    }
    if (req.body.trangThai !== undefined) {
      updateFields.trangThai = req.body.trangThai;
    }
    if (req.files.hinhAnh && req.files.hinhAnh.length > 0) {
      updateFields.hinhAnh = req.files.hinhAnh.map((file) => file.filename)[0];
    }

    if (req.body.tenMon.length > 100) {
      return res.json({ msg: "tên món vượt quá số lượng ký tự cho phép", success: false });
    }

    // Nếu không có trường nào cần cập nhật, trả về lỗi
    if (Object.keys(updateFields).length === 0) {
      return ({
        error: "Không có trường nào cần cập nhật",
        msg: "Không có trường nào cần cập nhật",
        success: false,
      });
    }

    // Thực hiện cập nhật chỉ với các trường cần thiết
    const filter = { _id: idMon };
    const index = await Mon.model.findOneAndUpdate(filter, updateFields, { new: true });
    return ({
      index,
      msg: "Sửa món thành công",
      success: true,
    });

  } catch (error) {
    return ({
      msg: "Lỗi khi sửa món",
      error,
      success: false,
    });
  }
};
const updatemonapi = async (req, res) => {
  const result = await updatemon(req, res);
  res.json(result)
}

// Hiển thị chi tiết món với id cụ thể

const getMonTheoid = async (req, res) => {
  try {
    const idMon = new mongo.Types.ObjectId(req.params.idMon);
    const mon = await Mon.model.findOne({ _id: idMon });
    const cuaHang = await CuaHang.model.findOne({ _id: mon.idCH });
    const loaiMon = await LoaiMon.model.findOne({ _id: mon.idLM });
    const trungBinhDanhGia = await DanhGiaCtrl.GetTrungBinhDanhGiaTheoMon(req, res);

    let index = {
      trungBinhDanhGia: trungBinhDanhGia.index,
      idMon: mon._id,
      idCH: mon.idCH,
      idLM: mon.idLM,
      tenMon: mon.tenMon,
      giaTien: mon.giaTien,
      trangThai: mon.trangThai,
      hinhAnh: req.protocol + "://" + req.get("host") + "/public/images/" + mon.hinhAnh,
      tenCH: cuaHang.tenCH,
      tenLM: loaiMon.tenLM
    }
    return res.json({
      index,
      msg: "Get món theo id thành công",
      success: true,
    });
  } catch (error) {

    return res.json({
      msg: "Lỗi khi lấy món theo id",
      success: false,
    });
  }
};


// khich hoat mon
const kichhoatMon = async (req, res, next) => {
  try {

    const id = req.params.id;
    const kichhoat = await Mon.model.findOneAndUpdate(
      { _id: id },
      { $set: { trangThai: true } },
      { new: true }
    );
    if (!kichhoat) {
      return res.json({ error: "Không tìm thấy loại món" });
    }
    res.json({
      msg: "đã kích hoạt cửa hàng",
      data: kichhoat,
      success: true,
    });
  } catch (error) {
    res.json({ success: false, msg: "Lỗi kích hoạt món", error: error });
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
  deleteMonWeb,
  updatemonapi,
  updatemon,
  getMonTheoid,
  kichhoatMon,
  getMonCuaCuaHang,
  getMonCuaLoaiMon,
  getTatCaMon,
  getSoLuongTatCaMon
};
