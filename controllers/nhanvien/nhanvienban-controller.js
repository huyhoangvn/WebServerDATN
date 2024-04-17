const { error } = require("jquery");
const { model: NhanVien } = require("../../model/NhanVien");

const addNhanVien = async (req, res, next) => {
  try {
    // Kiểm tra các trường thông tin nhân viên
    if (!req.body || !req.body.taiKhoan || !req.body.matKhau) {
      return res.json({
        success: false,
        msg: "Thông tin nhân viên không đầy đủ hoặc không hợp lệ.",
      });
    }

    if (req.body.taiKhoan.length < 6 || req.body.matKhau.length < 6) {
      return res.json({
        success: false,
        msg: "tài khoản và mật khẩu phải có ít nhất 6 ký tự."
      });
    }
    if (req.body.taiKhoan.length > 50 || req.body.matKhau.length > 50) {
      return res.json({
        success: false,
        msg: "tài khoản và mật khẩu không được vượt quá 50 ký tự"
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.taiKhoan)) {
      return res.json({
        success: false,
        msg: "tài khoản không đúng định dạng."
      });
    }
    // Tạo một nhân viên mới từ body
    const newNhanVien = new NhanVien(req.body);
    // save nhân viên mới vào cơ sở dữ liệu
    const savedNhanVien = await newNhanVien.save();
    // check kết quả lưu
    if (!savedNhanVien) {
      res.json({ success: false, msg: "Lưu nhân viên không thành công." });
    }
    // ouput -> thông tin nhân viên sau khi đã lưu thành công
    res.json({
      success: true,
      dataSave: savedNhanVien,
      msg: "Nhân viên đã được thêm thành công.",
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, msg: "Đã xảy ra lỗi khi thêm nhân viên" });
  }
};

const deleteNhanVien = async (req, res, next) => {
  try {
    // Lấy id từ params
    const nhanVienId = req.params.id;
    // Tìm kiếm nhân viên dựa trên id và cập nhật trạng thái thành 0
    const updatedNhanVien = await NhanVien.findOneAndUpdate(
      { _id: nhanVienId },
      { $set: { trangThai: 0 } },
      { new: true } // Trả về bản ghi đã được cập nhật
    );
    // Kiểm tra nếu không tìm thấy nhân viên
    if (!updatedNhanVien) {
      return res.json({ success: false, error: "Không tìm thấy nhân viên", msg: "Không tìm thấy nhân viên" });
    }
    res.json({
      success: true,
      msg: "Đã cập nhật trạng thái thành công",
      data: updatedNhanVien,
    });
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      msg: "Đã xảy ra lỗi khi cập nhật trạng thái nhân viên",
    });
  }
};

const updateNhanVien = async (req, res) => {
  try {
    // Lấy id từ params
    const nhanVienId = req.params.id;
    const updateNV = await NhanVien.findByIdAndUpdate(
      { _id: nhanVienId },
      req.body,
      { new: true }
    );
    //check có nv k
    if (!updateNV) {
      return res.json({ success: false, msg: "Không tìm thấy nhân viên" });
    }
    //cập nhật
    res.json({
      success: true,
      msg: "Đã cập nhật thông tin nhân viên thành công",
      dataUpdate: updateNV,
    });
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      msg: e.message || "Đã xảy ra lỗi khi cập nhật trạng thái nhân viên",
    });
  }
};

const doiMatKhau = async (req, res) => {
  try {
    const id = req.params.id;
    const matKhauCu = req.body.matKhauCu;
    const matKhauMoi = req.body.matKhauMoi;

    // Kiểm tra trường matKhauMoi có tồn tại hay không
    if (req.body.matKhauCu.length < 6 || req.body.matKhauMoi.length < 6) {
      return res.json({ msg: "mật khẩu cũ và mật khẩu mới phải có ít nhất 6 ký tự.", success: false });
    }
    if (req.body.matKhauCu.length > 50 || req.body.matKhauMoi.length > 50) {
      return res.json({ msg: "mật khẩu cũ và mật khẩu mới phải không được vượt quá 50 kí tự", success: false });
    }
    if (!matKhauMoi) {
      return res.json({
        success: false,
        msg: "Vui lòng cung cấp mật khẩu mới.",
      });
    }

    const item = await NhanVien.findById(id);
    if (!item) {
      return res.json({ success: false, msg: "Không tìm thấy nhân viên" });
    }

    // Kiểm tra mật khẩu cũ
    if (matKhauCu !== item.matKhau) {
      return res.json({ success: false, msg: "Mật khẩu cũ không chính xác." });
    }

    // Cập nhật mật khẩu mới
    item.matKhau = matKhauMoi;
    const savedNhanVien = await item.save();

    res.json({
      success: true,
      msg: "Mật khẩu đã được cập nhật thành công.",
      dataUpdate: savedNhanVien,
    });
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      msg: e.message || "Đã xảy ra lỗi khi cập nhật mật khẩu nhân viên",
    });
  }
};

// vd postMan: http://localhost:3000/api/nhanvien/nhanvienban?idCuaHang=65c5df2e21788ae1b84da5d9&tenNhanVien=4&page=1&limit=2
const getListNhanVien = async (req, res) => {
  try {
    const idCuaHang = req.params.idCuaHang;
    const tenNhanVien = req.query.tenNhanVien;
    const page = parseInt(req.query.page) || 1; // Trang mặc định là 1
    const limit = parseInt(req.query.limit) || 10; // Số lượng kết quả mỗi trang mặc định là 10

    // Kiểm tra xem idCuaHang có
    if (!idCuaHang) {
      return res.json({
        success: false,
        msg: "Vui lòng cung cấp id của cửa hàng.",
      });
    }

    // Tạo một query
    let query = { idCH: idCuaHang };

    // Nếu tenNhanVien được cung cấp,  tìm kiếm theo tên
    if (tenNhanVien) {
      query.tenNV = { $regex: tenNhanVien, $options: "i" };
    }

    const nhanViens = await NhanVien.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      msg: "Tìm kiếm thành công",
      data: nhanViens,
      pageInfo: {
        tranghientai: page,
        soluong: nhanViens.length,
        tongtrang: Math.ceil(nhanViens.length / limit),
      },
    });
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      msg:
        e.message || "Đã xảy ra lỗi khi lấy danh sách nhân viên của cửa hàng",
    });
  }
};
const chiTietNhanVien = async (req, res) => {
  try {
    const idNhanVien = req.params.id;

    const nhanVien = await NhanVien.findById(idNhanVien)
      .select("-taiKhoan -matKhau") // Exclude taiKhoan and matKhau fields
      .exec();

    if (!nhanVien) {
      return res.json({ success: false, msg: "Không tìm thấy nhân viên" });
    }

    res.json({ success: true, data: nhanVien });
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      msg: e.message || "Đã xảy ra lỗi khi lấy chi tiết nhân viên",
    });
  }
};

//Api
const addNhanVienApi = async (req, res, next) => {
  try {
    const result = await addNhanVien(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: error.message || "Đã xảy ra lỗi khi kích hoạt cửa hàng",
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};

const deleteNhanVienApi = async (req, res, next) => {
  try {
    const result = await deleteNhanVien(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: error.message || "Đã xảy ra lỗi khi kích hoạt cửa hàng",
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};

const updateNhanVienApi = async (req, res, next) => {
  try {
    const result = await updateNhanVien(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: error.message || "Đã xảy ra lỗi khi kích hoạt cửa hàng",
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const doiMatKhauApi = async (req, res, next) => {
  try {
    const result = await doiMatKhau(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: error.message || "Đã xảy ra lỗi khi kích hoạt cửa hàng",
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const getListNhanVienApi = async (req, res, next) => {
  try {
    const result = await getListNhanVien(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: error.message || "Đã xảy ra lỗi khi kích hoạt cửa hàng",
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const chiTietNhanVienApi = async (req, res, next) => {
  try {
    const result = await chiTietNhanVien(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: error.message || "Đã xảy ra lỗi khi kích hoạt cửa hàng",
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};

module.exports = {
  addNhanVienApi,
  deleteNhanVienApi,
  updateNhanVienApi,
  doiMatKhauApi,
  getListNhanVienApi,
  chiTietNhanVienApi,
};
