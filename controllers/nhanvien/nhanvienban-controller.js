const { model: NhanVien } = require("../../model/NhanVien");

class NhanVienController {
  async addNhanVien(req, res) {
    try {
      // check thông tin body
      if (!req.body || !req.body.taiKhoan || !req.body.matKhau) {
        throw new Error("Thông tin nhân viên không đầy đủ hoặc không hợp lệ.");
      }
      // Tạo một nhân viên mới từ body
      const newNhanVien = new NhanVien(req.body);
      // save nhân viên mới vào cơ sở dữ liệu
      const savedNhanVien = await newNhanVien.save();
      // check kết quả lưu
      if (!savedNhanVien) {
        throw new Error("Lưu nhân viên không thành công.");
      }
      // ouput -> thông tin nhân viên sau khi đã lưu thành công
      res.status(200).json({
        dataSave: savedNhanVien,
        msg: "Nhân viên đã được thêm thành công.",
      });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ error: e.message || "Đã xảy ra lỗi khi thêm nhân viên" });
    }
  }

  async deleteNhanVien(req, res) {
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
  }

  async updateNhanVien(req, res) {
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
        return res.status(404).json({ error: "Không tìm thấy nhân viên" });
      }
      //cập nhật
      res.status(200).json({
        msg: "Đã cập nhật thông tin nhân viên thành công",
        dataUpdate: updateNV,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        success: false,
        error: e.message || "Đã xảy ra lỗi khi cập nhật trạng thái nhân viên",
      });
    }
  }
}

module.exports = new NhanVienController();
