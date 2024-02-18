const HinhAnhMon = require("../../model/HinhAnhMon");
const Mon = require("../../model/Mon");

const addHinhAnhMon = async (req, res) => {
  try {
    // Lấy dữ liệu từ request body

    const idMon = req.body.idMon;
    const hinhAnh = "default_image.png";
    const trangThai = 0; // Đặt trạng thái là 0
    // Kiểm tra tính hợp lệ của dữ liệu
    if (!hinhAnh || !idMon) {
      return res.status(400).json({ msg: "Vui lòng điền đầy đủ thông tin" });
    }

    // Kiểm tra xem cửa hàng đã tồn tại hay chưa
    const item = await HinhAnhMon.model.findOne({ idMon: idMon });
    if (item) {
      return res
        .status(400)
        .json({ msg: "Món đã tồn tại", dataSave: undefined });
    }

    // Tạo mới cửa hàng
    const savehinhanhmon = await HinhAnhMon.model.create({
      idMon: idMon,
      hinhAnh:
        req.protocol +
        "://" +
        req.get("host") +
        "/public/stylesheets/images" +
        hinhAnh,
      trangThai: trangThai,
    });
    // Trả về kết quả
    return res.json({ msg: "Thêm thành công", dataSave: savehinhanhmon });
  } catch (e) {
    // Xử lý lỗi
    return res
      .status(500)
      .json({ msg: "Đã xảy ra lỗi khi thêm cửa hàng", error: e.message });
  }
};

const deletehinhanhmon = async (req, res) => {
    try {
        const id = req.params.id;
        const xoahinhanhmon = await HinhAnhMon.model.findOneAndUpdate(
            { _id: id },
            { $set: { trangThai: 0 } },
            { new: true } // Trả về bản ghi đã được cập nhật
          );

        if (!xoahinhanhmon) {
            return res.status(404).json({ error: "Không tìm thấy hình ảnh món" });
        }

        res.status(200).json({
            msg: "Đã xóa hình ảnh món ",
            data: xoahinhanhmon,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Đã xảy ra lỗi khi hủy kích hoạt cửa hàng" });
    }
};

// kich hoat loai mon
const kichhoathinhanhmon = async (req, res) => {
  try {
    const id = req.params.id;
    const kichhoat = await HinhAnhMon.model.findOneAndUpdate(
      { _id: id },
      { $set: { trangThai: true } },
      { new: true }
    );
    if (!kichhoat) {
      return res.status(404).json({ error: "Không tìm thấy hình ảnh món" });
    }
    res.status(200).json({
      msg: "đã kích hoạt cửa hàng",
      data: kichhoat,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi kích hoạt hình ảnh món", error: error });
  }
};

// tìm kiếm tên http://localhost:3000/api/nhanvien/hinhanh?idMon =
const gethinhanhmon = async (req, res) => {
  try {
    let filter = {};
    if (req.query.idmon) {
      filter.idMon = new RegExp(req.query.idmon, "i");
    }

    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const danhsachhinhanhmon =
      Object.keys(filter).length === 0
        ? await HinhAnhMon.model.find().skip(skip).limit(pageSize)
        : await HinhAnhMon.model.find(filter).skip(skip).limit(pageSize);

    res.status(200).json({
      msg: "Hiển thị danh sách hình ảnh món thành công",
      data: danhsachhinhanhmon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy danh sách hình ảnh món" });
  }
};

// api
const addHinhAnhMonApi = async (req, res, next) => {
  try {
    const result = await addHinhAnhMon(req, res, next);
    res.json(result);
  } catch (error) {
    // Check if headers have already been sent
    if (res.headersSent) {
      console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
    } else {
      res
        .status(500)
        .json({
          msg: "Đã xảy ra lỗi khi thêm hình ảnh món",
          error: error.message,
        });
    }
  }
};

const deletehinhanhmonApi = async (req, res, next) => {
  try {
    const result = await deletehinhanhmon(req, res, next);
    res.json(result);
  } catch (error) {
    // Check if headers have already been sent
    if (res.headersSent) {
      console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
    } else {
      res
        .status(500)
        .json({
          msg: "Đã xảy ra lỗi khi thêm hình ảnh món",
          error: error.message,
        });
    }
  }
};

const kichhoathinhanhmonApi = async (req, res, next) => {
  try {
    const result = await kichhoathinhanhmon(req, res, next);
    res.json(result);
  } catch (error) {
    // Check if headers have already been sent
    if (res.headersSent) {
      console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
    } else {
      res
        .status(500)
        .json({
          msg: "Đã xảy ra lỗi khi thêm hình ảnh món",
          error: error.message,
        });
    }
  }
};

const gethinhanhmonApi = async (req, res, next) => {
  try {
    const result = await gethinhanhmon(req, res, next);
    res.json(result);
  } catch (error) {
    // Check if headers have already been sent
    if (res.headersSent) {
      console.error(" Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
    } else {
      res
        .status(500)
        .json({
          msg: "Đã xảy ra lỗi khi thêm hình ảnh món",
          error: error.message,
        });
    }
  }
};
module.exports = {
  addHinhAnhMonApi,
  deletehinhanhmonApi,
  kichhoathinhanhmonApi,
  gethinhanhmonApi,
};
