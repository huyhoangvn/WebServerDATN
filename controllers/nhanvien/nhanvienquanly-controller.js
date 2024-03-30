const { model: NhanVien } = require("../../model/NhanVien");

// vd postMan: http://localhost:3000/api/nhanvien/nhanvienquanly/them-nhanvien-ban?id=65cde08fd4d49481146db396
const addNhanVienBan = async (req, res, next) => {
  try {
    const idNhanVien = req.params.id;
    console.log(idNhanVien);

    // Kiểm tra xem Nhân viên có phân quyền là 0 không
    const item = await NhanVien.findById(idNhanVien);
    if (!item) {
      return res.json({ success: false, msg: "Không tìm thấy nhân viên." });
    }

    if (item && item.phanQuyen === 0) {
      // Kiểm tra xem tài khoản đã tồn tại hay chưa
      const existingNhanVien = await NhanVien.findOne({
        taiKhoan: req.body.taiKhoan,
      });

      if (existingNhanVien) {
        // Nếu tài khoản đã tồn tại, trả về thông báo lỗi
        return res.json({ success: false, msg: "Tên tài khoản đã tồn tại" });
      }

      // Kiểm tra các trường thông tin nhân viên
      if (!req.body || !req.body.taiKhoan || !req.body.matKhau) {
        return res.json({
          success: false,
          msg: "Thông tin nhân viên không đầy đủ hoặc không hợp lệ.",
        });
      }

      // Thiết lập hình ảnh mặc định nếu không có ảnh được tải lên
      const hinhAnh = "default-avatar.png";

      const newNhanVien = new NhanVien({
        ...req.body,
        hinhAnh:
          req.protocol + "://" + req.get("host") + "/public/images/" + hinhAnh,
      });

      const savedNhanVien = await newNhanVien.save();
      if (!savedNhanVien) {
        return res.json({
          success: false,
          msg: "Lưu nhân viên không thành công.",
        });
      }

      return res.json({
        success: true,
        dataSave: savedNhanVien,
        msg: "Nhân viên đã được thêm thành công.",
      });
    } else {
      return res.json({
        success: false,
        msg: "Bạn không có quyền thêm Nhân viên.",
      });
    }
  } catch (e) {
    console.error(e);
    res.json({ success: false, msg: "Đã xảy ra lỗi khi thêm nhân viên." });
  }
};

// vd postman: http://localhost:3000/api/nhanvien/nhanvienquanly/sua-nhanvien-ban?id=65cde122d4d49481146db3bb&idNhanVienBan=65cde1bed4d49481146db3d1
const suaNhanVienBan = async (req, res, next) => {
  try {
    const idNhanVien = req.params.id;
    const idEdit = req.params.idNhanVienBan;
    const { tenNV, diaChi, sdt } = req.body;

    let hinhAnh = null; // Khởi tạo hình ảnh mặc định là null

    // Kiểm tra xem có tệp hình ảnh được tải lên hay không
    if (req.files && req.files.length > 0) {
      // Lưu tên của tệp hình ảnh vào biến hinhAnh
      hinhAnh = req.files[0].filename;
    }

    // Kiểm tra trống dữ liệu cho các trường
    if (!tenNV || !diaChi || !sdt) {
      return res.json({
        success: false,
        msg: "Thông tin nhân viên không đầy đủ hoặc không hợp lệ.",
      });
    }

    // Kiểm tra xem nhân viên có tồn tại không
    const item = await NhanVien.findById(idNhanVien);
    if (!item) {
      return res.json({ success: false, msg: "Không tìm thấy nhân viên." });
    }

    // Kiểm tra quyền của nhân viên
    if (item.phanQuyen !== 0) {
      return res.json({ success: false, msg: "Nhân viên không có quyền cập nhật." });
    }

    // Cập nhật thông tin nhân viên và hình ảnh mới (nếu có)
    const updateData = {
      tenNV: tenNV,
      diaChi: diaChi,
      sdt: sdt,
    };
    if (hinhAnh) {
      updateData.hinhAnh = req.protocol + "://" + req.get("host") + "/public/images/" + hinhAnh;
    }

    // Thực hiện cập nhật thông tin nhân viên
    const updateNV = await NhanVien.findByIdAndUpdate(
      { _id: idEdit },
      updateData,
      { new: true }
    );

    // Kiểm tra xem có nhân viên được cập nhật không
    if (!updateNV) {
      return res.json({ success: false, msg: "Không tìm thấy hoặc không thể cập nhật thông tin nhân viên." });
    }

    // Trả về kết quả thành công
    res.json({
      success: true,
      dataUpdate: updateNV,
      msg: "Đã cập nhật thông tin nhân viên thành công",
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, msg: "Đã xảy ra lỗi khi cập nhật nhân viên." });
  }
};

const huyKichHoatNhanVien = async (req, res, next) => {
  try {
    const idNhanVien = req.params.id;
    const idEdit = req.params.idNhanVienBan;
    const item = await NhanVien.findById(idNhanVien);

    if (!item) {
      return res.json({ success: false, msg: "Không tìm thấy nhân viên." });
    }

    if (item && item.phanQuyen === 0) {
      const projection = { trangThai: 1 }; // Di chuyển việc khai báo lên trước khi sử dụng
      const editUser = await NhanVien.findById(idEdit, projection); // Sử dụng projection chỉ hiển thị trường trangThai
      console.log("🚀 ~ huyKichHoatNhanVien ~ editUser:", editUser);

      const newTrangThai = !editUser.trangThai;
      const updateNV = await NhanVien.findByIdAndUpdate(
        { _id: idEdit },
        { $set: { trangThai: newTrangThai } },
        { new: true, projection } // Sử dụng projection để chỉ định trường trả về
      );

      if (!updateNV) {
        return res.json({ success: false, error: "Không tìm thấy nhân viên" });
      }

      // Cập nhật thành công
      res.json({
        success: true,
        index: updateNV,// Chỉ trả về trường trangThai
        msg: "Đã cập nhật trạng thái thành công",
      });
    } else {
      res.json({ success: false, msg: "Nhân viên không có quyền cập nhật" });
    }
  } catch (e) {
    console.error(e);
    res.json({ success: false, msg: "Đã xảy ra lỗi khi cập nhật trạng thái nhân viên." });
  }
};




const kichHoatNhanVienBan = async (req, res, next) => {
  try {
    const idNhanVien = req.params.id;
    const idEdit = req.params.idNhanVienBan;
    const item = await NhanVien.findById(idNhanVien);

    if (!item) {
      return res.json({ success: false, msg: "Không tìm thấy nhân viên." });
    }

    if (item && item.phanQuyen === 0) {
      const updateNV = await NhanVien.findByIdAndUpdate(
        { _id: idEdit },
        { $set: { trangThai: 1 } },
        { new: true }
      );

      // Kiểm tra xem có nhân viên không
      if (!updateNV) {
        return json({ success: false, error: "Không tìm thấy nhân viên" });
      }
      // Cập nhật thành công
      res.json({
        success: true,
        msg: "kích hoạt thành công",
        dataUpdate: updateNV,
      });
    } else {
      res.json({ success: false, msg: "Nhân viên không có quyền cập nhật" });
    }
  } catch (e) {
    console.error(e);
    res.json({ success: false, msg: "Đã xảy ra lỗi khi cập nhật nhân viên." });
  }
};

// nhân viên quản lý

const addNhanVienQuanLy = async (req, res, next) => {
  try {
    const existingNhanVien = await NhanVien.findOne({
      taiKhoan: req.body.taiKhoan,
    });
    if (existingNhanVien) {
      // Nếu tài khoản đã tồn tại, trả về thông báo lỗi
      return res.json({ success: false, msg: "Tên tài khoản đã tồn tại" });
    }

    // Kiểm tra các trường thông tin nhân viên
    if (!req.body || !req.body.taiKhoan || !req.body.matKhau) {
      return res.json({
        success: false,
        msg: "Thông tin nhân viên không đầy đủ hoặc không hợp lệ.",
      });
    }

    // Thiết lập hình ảnh mặc định nếu không có ảnh được tải lên
    const hinhAnh = "default-avatar.png";

    const newNhanVien = new NhanVien({
      ...req.body,
      phanQuyen: 0,
      trangThai: true,
      hinhAnh:
        req.protocol + "://" + req.get("host") + "/public/images/" + hinhAnh,
    });

    const savedNhanVien = await newNhanVien.save();
    if (!savedNhanVien) {
      res.json({ success: false, msg: "Lưu nhân viên không thành công." });
    }

    return res.json({
      success: true,
      dataSave: savedNhanVien,
      msg: "Nhân viên đã được thêm thành công.",
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, msg: "Đã xảy ra lỗi khi cập nhật nhân viên." });
  }
};

const xoaNhanVienQuanLy = async (req, res, next) => {
  try {
    const idNhanVien = req.params.id;
    const item = await NhanVien.findById(idNhanVien);

    if (!item) {
      return res.json({ success: false, msg: "Không tìm thấy nhân viên." });
    }

    const xoa = await NhanVien.findByIdAndUpdate(
      { _id: idNhanVien },
      { $set: { trangThai: 0 } },
      { new: true }
    );

    // Kiểm tra xem có nhân viên không
    if (!xoa) {
      return json({ success: false, error: "Không tìm thấy nhân viên" });
    }
    // Cập nhật thành công
    res.json({
      success: true,
      msg: "xoá thành công",
      data: xoa,
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, msg: "Đã xảy ra lỗi khi cập nhật nhân viên." });
  }
};
const kichHoatNhanVienQuanLy = async (req, res, next) => {
  try {
    const idNhanVien = req.params.id;
    const item = await NhanVien.findById(idNhanVien);

    if (!item) {
      return res.json({ success: false, msg: "Không tìm thấy nhân viên." });
    }
    const kichHoat = await NhanVien.findByIdAndUpdate(
      { _id: idNhanVien },
      { $set: { trangThai: 1 } },
      { new: true }
    );

    // Kiểm tra xem có nhân viên không
    if (!kichHoat) {
      return json({ success: false, error: "Không tìm thấy nhân viên" });
    }
    // Cập nhật thành công
    res.json({
      success: true,
      msg: "kích hoạt thành công",
      data: kichHoat,
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, msg: "Đã xảy ra lỗi khi cập nhật nhân viên." });
  }
};
const xoaCungtNhanVienQuanLy = async (req, res, next) => {
  try {
    const idNhanVien = req.params.id;
    const item = await NhanVien.findById(idNhanVien);

    if (!item) {
      return res.json({ success: false, msg: "Không tìm thấy nhân viên." });
    }

    // Delete the employee
    await NhanVien.findByIdAndDelete(item._id);

    // Return success message
    res.json({
      success: true,
      msg: "Xóa nhân viên thành công",
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, msg: "Đã xảy ra lỗi khi xóa nhân viên." });
  }
};
const updateCuahang = async (req, res, next) => {
  try {
    const idNhanVien = req.params.id;
    const idCH = req.body.idCH;
    if (!idNhanVien || !idCH) {
      return res.json({
        success: false,
        msg: "Vui lòng cung cấp đầy đủ thông tin.",
      });
    }

    const updateNV = await NhanVien.findByIdAndUpdate(
      idNhanVien,
      { $set: { idCH } },
      { new: true }
    );

    if (!updateNV) {
      return json({ success: false, error: "Không tìm thấy nhân viên." });
    }

    res.json({
      success: true,
      msg: "Sửa cửa hàng thành công",
      dataUpdate: updateNV,
    });
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      msg: "Đã xảy ra lỗi khi sửa cửa hàng by nhân viên.",
    });
  }
};
const updateNhanvienQuanLy = async (req, res, next) => {
  try {
    const idNhanVien = req.params.id;
    const { tenNV, gioiTinh, diaChi, sdt } = req.body;

    // Kiểm tra trống dữ liệu cho các trường
    if (!tenNV || !gioiTinh || !diaChi || !sdt) {
      return res.json({
        success: false,
        msg: "Thông tin nhân viên không đầy đủ hoặc không hợp lệ.",
      });
    }
    const item = await NhanVien.findById(idNhanVien);

    if (!item) {
      return res.json({ success: false, msg: "Không tìm thấy nhân viên." });
    }

    const updateNV = await NhanVien.findByIdAndUpdate(
      { _id: idNhanVien },
      {
        tenNV: tenNV,
        gioiTinh: gioiTinh,
        diaChi: diaChi,
        sdt: sdt,
      },
      { new: true }
    );

    // Kiểm tra xem có nhân viên không
    if (!updateNV) {
      return json({ success: false, msg: "Không tìm thấy nhân viên" });
    }
    // Cập nhật thành công
    res.json({
      success: true,
      msg: "Đã cập nhật thông tin nhân viên thành công",
      dataUpdate: updateNV,
    });
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      msg: "Đã xảy ra lỗi khi sửa cửa hàng by nhân viên.",
    });
  }
};
const updateMatKhau = async (req, res, next) => {
  try {
    const id = req.params.id;
    const matKhauCu = req.body.matKhauCu;
    const matKhauMoi = req.body.matKhauMoi;

    // Kiểm tra trường matKhauMoi có tồn tại hay không
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
    res.json({ success: false, msg: "Đã xảy ra lỗi khi đổi mật khẩu" });
  }
};
// const getListNhanVienQuanly = async (req, res, next) => {
//   try {
//     const { tenNV, phanQuyen, trangThai, limit } = req.query;

//     // Sử dụng mô hình NhanVien để thực hiện truy vấn
//     const query = {};

//     if (tenNV) {
//       query.tenNV = { $regex: tenNV, $options: "i" };
//     }

//     if (phanQuyen) {
//       query.phanQuyen = phanQuyen;
//     }

//     if (trangThai !== undefined && trangThai !== '') {
//       query.trangThai = trangThai === 'true'; // Chuyển đổi từ chuỗi sang boolean
//     }

//     // Chỉ định trường cần hiển thị
//     const projection = { email: 1, sdt: 1, tenNV: 1, trangThai: 1, _id: 1, phanQuyen: 1,hinhAnh: 1,gioiTinh: 1,taiKhoan: 1, diaChi: 1};

//     // Thực hiện truy vấn để lấy danh sách nhân viên quản lý
//     let listNhanVienQuanLy = NhanVien.find(query, projection);

//     // Áp dụng giới hạn dữ liệu nếu có
//     if (limit) {
//       listNhanVienQuanLy = listNhanVienQuanLy.limit(parseInt(limit));
//     }

//     // Thực hiện truy vấn
//     listNhanVienQuanLy = await listNhanVienQuanLy;

//     res.json({
//       success: true,
//       index: listNhanVienQuanLy,
//       soluong: listNhanVienQuanLy.length,
//     });
//   } catch (error) {
//     console.error(error);
//     res.json({
//       success: false,
//       msg: "Đã xảy ra lỗi khi lấy danh sách nhân viên quản lý.",
//     });
//   }
// };


const getListNhanVienQuanly = async (req, res, next) => {
  try {
    const { tenNV, phanQuyen, trangThai, page } = req.query;
    const limitPerPage = 10;
    let currentPage = parseInt(page) || 1;

    // Kiểm tra nếu page là '' thì gán currentPage bằng 1
    if (page === '') {
      currentPage = 1;
    }

    // Sử dụng mô hình NhanVien để thực hiện truy vấn
    const query = {};

    if (tenNV) {
      query.tenNV = { $regex: tenNV, $options: "i" };
    }

    if (phanQuyen) {
      query.phanQuyen = phanQuyen;
    }

    if (trangThai !== undefined && trangThai !== '') {
      query.trangThai = trangThai === 'true'; // Chuyển đổi từ chuỗi sang boolean
    }

    // Chỉ định trường cần hiển thị
    const projection = { email: 1, sdt: 1, tenNV: 1, trangThai: 1, _id: 1, phanQuyen: 1, hinhAnh: 1, gioiTinh: 1, taiKhoan: 1, diaChi: 1 };

    // Thực hiện truy vấn để lấy danh sách nhân viên quản lý
    let listNhanVienQuanLy = NhanVien.find(query, projection);

    // Kiểm tra nếu page là '' thì không áp dụng phân trang
    if (page !== '') {
      // Áp dụng phân trang
      listNhanVienQuanLy = listNhanVienQuanLy.skip((currentPage - 1) * limitPerPage).limit(limitPerPage);
    }

    // Thực hiện truy vấn
    listNhanVienQuanLy = await listNhanVienQuanLy;

    res.json({
      success: true,
      index: listNhanVienQuanLy,
      currentPage,
      totalPages: Math.ceil(listNhanVienQuanLy.length / limitPerPage),
      totalItems: listNhanVienQuanLy.length,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      msg: "Đã xảy ra lỗi khi lấy danh sách nhân viên quản lý.",
    });
  }
};



const chiTietNhanVienQuanLy = async (req, res, next) => {
  try {
    const idNhanVien = req.params.id;
    const nhanVien = await NhanVien.findById(idNhanVien)
      .select("-matKhau") // Exclude taiKhoan and matKhau fields
      .exec();
    if (!nhanVien) {
      return json({ error: "Không tìm thấy nhân viên" });
    }
    res.json({
      success: true, index: nhanVien, msg: "Lấy dữ liệu thành công",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      msg: "Đã xảy ra lỗi khi lấy chi tiết nhân viên quản lý.",
    });
  }
};

//Api

const addNhanVienBanApi = async (req, res, next) => {
  try {
    const result = await addNhanVienBan(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi thêm nhân viên bán",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const suaNhanVienBanApi = async (req, res, next) => {
  try {
    const result = await suaNhanVienBan(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi sửa nhân viên bán",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};

const huyKichHoatNhanVienApi = async (req, res, next) => {
  try {
    const result = await huyKichHoatNhanVien(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi xoá nhân viên bán",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};

const kichHoatnhanVienBanApi = async (req, res, next) => {
  try {
    const result = await kichHoatNhanVienBan(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi kích hoạt nhân viên bán",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const xoaNhanVienQuanLyApi = async (req, res, next) => {
  try {
    const result = await xoaNhanVienQuanLy(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi xoá mềm",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const kichHoatnhanVienQuanLyApi = async (req, res, next) => {
  try {
    const result = await kichHoatNhanVienQuanLy(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi kích hoạt cửa hàng",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const addNhanVienQuanLyApi = async (req, res, next) => {
  try {
    const result = await addNhanVienQuanLy(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi thêm nhan viên",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const xoaCungNhanVienQuanLyApi = async (req, res, next) => {
  try {
    const result = await xoaCungtNhanVienQuanLy(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi xoá cứng",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const updateCuahangApi = async (req, res, next) => {
  try {
    const result = await updateCuahang(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi sửa cửa hàng",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const updateNhanvienQuanLyApi = async (req, res, next) => {
  try {
    const result = await updateNhanvienQuanLy(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi sửa thông tin nhân viên",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const updateMatKhauApi = async (req, res, next) => {
  try {
    const result = await updateMatKhau(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi đổi mật khẩu",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const getListNhanVienQuanlyApi = async (req, res, next) => {
  try {
    const result = await getListNhanVienQuanly(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi lấy danh sách",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const chiTietNhanVienQuanLyApi = async (req, res, next) => {
  try {
    const result = await chiTietNhanVienQuanLy(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi lây chi tiết nhân viên",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};

const getTatCaNhanVienQuanLy = async (req, res) => {
  try {

    const trang = parseInt(req.query.trang) || 1;
    if (trang === '') {
      currentPage = 1;
    }
    const filter = {};
    if (typeof (req.query.tenNV) !== 'undefined' && req.query.tenNV !== "") {
      filter.tenNV = { $regex: req.query.tenNV, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof req.query.thoiGianTao !== 'undefined' && req.query.thoiGianTao !== "") {
      const parts = req.query.thoiGianTao.split('/');
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Chuyển định dạng thành yyyy-mm-dd
      filter.thoiGianTao = { $gte: new Date(formattedDate) };
    }
    if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if (trangThaiValue === 1 || trangThaiValue === 0) {
        filter.trangThai = trangThaiValue === 1;
      }
    }


    const result = await NhanVien.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "CuaHang",
          localField: "idCH",
          foreignField: "_id",
          as: "cuahang"
        }
      },
      { $unwind: "$cuahang" },
      {
        $project: {
          _id: 1,
          idCH: 1,
          tenCH: "$cuahang.tenCH",
          thoiGianTao: 1,
          email: 1, sdt: 1, tenNV: 1, trangThai: 1, phanQuyen: 1, hinhAnh: 1, gioiTinh: 1, taiKhoan: 1, diaChi: 1
        }
      },
      {
        $skip: (trang - 1) * 10,
      },
      {
        $limit: 10,
      },

    ]);
    return {
      count: result.length,
      list: result,
      message: 'Get tat ca khuyen mai thanh cong',
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
const getSoLuongNhanVienQuanLy = async (req, res) => {
  try {

    const trang = parseInt(req.query.trang) || 1;
    if (trang === '') {
      currentPage = 1;
    }
    const filter = {};
    if (typeof (req.query.tenNV) !== 'undefined' && req.query.tenNV !== "") {
      filter.tenNV = { $regex: req.query.tenNV, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof req.query.thoiGianTao !== 'undefined' && req.query.thoiGianTao !== "") {
      const parts = req.query.thoiGianTao.split('/');
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Chuyển định dạng thành yyyy-mm-dd
      filter.thoiGianTao = { $gte: new Date(formattedDate) };
    }
    if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if (trangThaiValue === 1 || trangThaiValue === 0) {
        filter.trangThai = trangThaiValue === 1;
      }
    }


    const result = await NhanVien.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "CuaHang",
          localField: "idCH",
          foreignField: "_id",
          as: "cuahang"
        }
      },
      { $unwind: "$cuahang" },
      {
        $project: {
          _id: 1,
          idCH: 1,
          tenCH: "$cuahang.tenCH",
          thoiGianTao: 1,
          email: 1, sdt: 1, tenNV: 1, trangThai: 1, phanQuyen: 1, hinhAnh: 1, gioiTinh: 1, taiKhoan: 1, diaChi: 1
        }
      },
      {
        $count: "count",
      }

    ]);
    return {
      count: result[0].count,
      success: true,
      msg: "Thành công"
    };

  } catch (error) {
    console.error(error);
    return {
      error: 'Lỗi khi lấy số lượng đánh giá theo tên khách hàng',
      success: false
    };
  }
};
module.exports = {
  addNhanVienBanApi,
  suaNhanVienBanApi,
  huyKichHoatNhanVienApi,
  kichHoatnhanVienBanApi,
  addNhanVienQuanLyApi,
  xoaNhanVienQuanLyApi,
  kichHoatnhanVienQuanLyApi,
  xoaCungNhanVienQuanLyApi,
  updateCuahangApi,
  updateNhanvienQuanLyApi,
  updateMatKhauApi,
  getListNhanVienQuanlyApi,
  chiTietNhanVienQuanLyApi,
  getSoLuongNhanVienQuanLy,
  getTatCaNhanVienQuanLy,
};
