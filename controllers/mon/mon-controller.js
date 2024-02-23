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

const getAnmonapi = async (req, res) => {
  try {
    const mon = await Mon.model.findById(req.params.id).populate("");
  } catch (error) {}
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

const getAllmonapi = async (req, res) => {
  try {
    const idCuaHang = req.params.idCuaHang;
    const tenMon = req.query.tenMon;
    const page = parseInt(req.query.page) || 1; // Trang mặc định là 1
    const limit = parseInt(req.query.limit) || 10; // Số lượng kết quả mỗi trang mặc định là 10

    // Kiểm tra xem idCuaHang có
    if (!idCuaHang) {
      return res
        .status(400)
        .json({ msg: "Vui lòng cung cấp id của cửa hàng." });
    }

    // Tạo một query
    let query = { idCH: idCuaHang };

    // Nếu tenNhanVien được cung cấp,  tìm kiếm theo tên
    if (tenMon) {
      query.tenMon = { $regex: tenMon, $options: "i" };
    }

    const mons = await Mon.model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      msg: "Tìm kiếm thành công",
      data: mons,
      pageInfo: {
        tranghientai: page,
        soluong: mons.length,
        tongtrang: Math.ceil(mons.length / limit),
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      error:
        e.message || "Đã xảy ra lỗi khi lấy danh sách nhân viên của cửa hàng",
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
  getAllmonapi,
  deletemonapi,
  updatemonapi,
  getMonTheoid,
  getDanhSachTenCuaHang,
  kichhoatMon
};
