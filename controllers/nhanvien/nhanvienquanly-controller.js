const { model: NhanVien } = require("../../model/NhanVien");

// vd postMan: http://localhost:3000/api/nhanvien/nhanvienquanly/them-nhanvien-ban?id=65cde08fd4d49481146db396
const addNhanVienBan = async (req, res, next) => {
    try {
      const idNhanVien = req.params.id;
      console.log(idNhanVien);
  
      // Kiểm tra xem Nhân viên có phân quyền là 0 không
      const item = await NhanVien.findById(idNhanVien);
      if (!item) {
        return res.json({ msg: "Không tìm thấy nhân viên." });
      }
  
      if (item && item.phanQuyen === 0) {
        // Kiểm tra xem tài khoản đã tồn tại hay chưa
        const existingNhanVien = await NhanVien.findOne({ taiKhoan: req.body.taiKhoan });
  
        if (existingNhanVien) {
          // Nếu tài khoản đã tồn tại, trả về thông báo lỗi
          return res.status(400).json({ msg: "Tên tài khoản đã tồn tại" });
        }
  
        // Kiểm tra các trường thông tin nhân viên
        if (!req.body || !req.body.taiKhoan || !req.body.matKhau) {
          return res.status(400).json({ msg: "Thông tin nhân viên không đầy đủ hoặc không hợp lệ." });
        }
  
        // Thiết lập hình ảnh mặc định nếu không có ảnh được tải lên
        const hinhAnh = 'default-avatar.png';
  
        const newNhanVien = new NhanVien({
          ...req.body,
          hinhAnh: req.protocol +
          "://" +
          req.get("host") +
          "/public/images/" +
          hinhAnh,
        });
  
        const savedNhanVien = await newNhanVien.save();
        if (!savedNhanVien) {
          throw new Error("Lưu nhân viên không thành công.");
        }
  
        return res.status(200).json({
          dataSave: savedNhanVien,
          msg: "Nhân viên đã được thêm thành công.",
        });
      } else {
        return res.status(403).json({
          msg: "Bạn không có quyền thêm Nhân viên.",
        });
      }
    } catch (e) {
      console.error(e);
      res.json({ msg: "Đã xảy ra lỗi khi thêm nhân viên." });
    }
  };


  // vd postman: http://localhost:3000/api/nhanvien/nhanvienquanly/sua-nhanvien-ban?id=65cde122d4d49481146db3bb&idNhanVienBan=65cde1bed4d49481146db3d1
  const suaNhanVienBan = async (req, res, next) => {
    try {
        const idNhanVien = req.params.id
        const idEdit = req.params.idNhanVienBan;
        const { tenNV, gioiTinh, diaChi, sdt } = req.body;

        // Kiểm tra trống dữ liệu cho các trường
        if (!tenNV || !gioiTinh || !diaChi || !sdt) {
            return res.status(400).json({ msg: "Thông tin nhân viên không đầy đủ hoặc không hợp lệ." });
        }
        const item = await NhanVien.findById(idNhanVien);

        if (!item) {
            return res.json({ msg: "Không tìm thấy nhân viên." });
        }

        if (item && item.phanQuyen === 0) {
            const updateNV = await NhanVien.findByIdAndUpdate(
                { _id: idEdit },
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
                return res.status(404).json({ error: "Không tìm thấy nhân viên" });
            }
            // Cập nhật thành công
            res.status(200).json({
                msg: "Đã cập nhật thông tin nhân viên thành công",
                dataUpdate: updateNV,
            });
        } else {
            res.status(403).json({ msg: "Nhân viên không có quyền cập nhật" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Đã xảy ra lỗi khi cập nhật nhân viên." });
    }
};
  const xoaNhanVienBan = async (req, res, next) => {
    try {
        const idNhanVien = req.params.id;
        const idEdit = req.params.idNhanVienBan;
        const item = await NhanVien.findById(idNhanVien);

        if (!item) {
            return res.json({ msg: "Không tìm thấy nhân viên." });
        }

        if (item && item.phanQuyen === 0) {
            const updateNV = await NhanVien.findByIdAndUpdate(
                { _id: idEdit },
                { $set: { trangThai: 0 } },
                { new: true }
            );

            // Kiểm tra xem có nhân viên không
            if (!updateNV) {
                return res.status(404).json({ error: "Không tìm thấy nhân viên" });
            }
            // Cập nhật thành công
            res.status(200).json({
                msg: "xoá thành công",
                dataUpdate: updateNV,
            });
        } else {
            res.status(403).json({ msg: "Nhân viên không có quyền cập nhật" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Đã xảy ra lỗi khi cập nhật nhân viên." });
    }
};
  const kichHoatNhanVienBan = async (req, res, next) => {
    try {
        const idNhanVien = req.params.id;
        const idEdit = req.params.idNhanVienBan;
        const item = await NhanVien.findById(idNhanVien);

        if (!item) {
            return res.json({ msg: "Không tìm thấy nhân viên." });
        }

        if (item && item.phanQuyen === 0) {
            const updateNV = await NhanVien.findByIdAndUpdate(
                { _id: idEdit },
                { $set: { trangThai: 1 } },
                { new: true }
            );

            // Kiểm tra xem có nhân viên không
            if (!updateNV) {
                return res.status(404).json({ error: "Không tìm thấy nhân viên" });
            }
            // Cập nhật thành công
            res.status(200).json({
                msg: "kích hoạt thành công",
                dataUpdate: updateNV,
            });
        } else {
            res.status(403).json({ msg: "Nhân viên không có quyền cập nhật" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Đã xảy ra lỗi khi cập nhật nhân viên." });
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
        res.status(500).json({
          msg: "Đã xảy ra lỗi khi kích hoạt cửa hàng",
          error: error.message,
        });
      } else {
        console.error("Headers have already been sent. Cannot send error response.");
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
        res.status(500).json({
          msg: "Đã xảy ra lỗi khi kích hoạt cửa hàng",
          error: error.message,
        });
      } else {
        console.error("Headers have already been sent. Cannot send error response.");
      }
    }
  };
  
const xoaNhanVienBanApi= async (req, res, next) => {
    try {
      const result = await xoaNhanVienBan(req, res, next);
      if (!res.headersSent) {
        res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
      }
    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({
          msg: "Đã xảy ra lỗi khi kích hoạt cửa hàng",
          error: error.message,
        });
      } else {
        console.error("Headers have already been sent. Cannot send error response.");
      }
    }
  };
const kichHoatnhanVienBanApi= async (req, res, next) => {
    try {
      const result = await kichHoatNhanVienBan(req, res, next);
      if (!res.headersSent) {
        res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
      }
    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({
          msg: "Đã xảy ra lỗi khi kích hoạt cửa hàng",
          error: error.message,
        });
      } else {
        console.error("Headers have already been sent. Cannot send error response.");
      }
    }
  };
  
  module.exports = {
    addNhanVienBanApi,
    suaNhanVienBanApi,
    xoaNhanVienBanApi,
    kichHoatnhanVienBanApi
  };