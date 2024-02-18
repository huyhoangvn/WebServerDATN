const { error } = require("jquery");
const Loaimon = require("../../model/LoaiMon");

const addloaimonApi = async (req, res, next) => {
  let msg = "";
  const tenLM = req.body.tenLM;

  //Validate khách hàng
  let foundLoaiMon = await Loaimon.model.findOne({
    tenLM: tenLM,
  });
  if (foundLoaiMon) {
    return { msg: "Khách hàng đã tồn tại" };
  }

  await Loaimon.model
    .create({
      tenLM: tenLM,
      trangThai: 1,
    })
    .then((response) => {
      msg = "Thêm mới loại món thành công";
    })
    .catch((err) => {
      msg = "Thêm mới loại món thất bại";
    });

  return {
    msg: msg,
  };
};
// Get All
const getchitietloaiMonApi = async (req, res, next) => {
  try {
    const id = req.params.id;
    const loaimon = await Loaimon.model.find(id);
    if (!loaimon) {
      res.status(500).json({ error: "không tìm thấy cửa hàng" });
    }
    res.status(200).json(loaimon);
  } catch (error) {
    res.status(500).send(error);
  }
};
// get loai mon
// tìm kiếm tên http://localhost:3000/api/nhanvien/loaimon?ten=lợn
const getloaimonApi = async (req, res) => {
  try {
    let filter = {};

    if (req.query.ten) {
      filter.tenLM = new RegExp(req.query.ten, "i");
    }

    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const danhsachloaimon =
      Object.keys(filter).length === 0
        ? await Loaimon.model.find().skip(skip).limit(pageSize)
        : await Loaimon.model.find(filter).skip(skip).limit(pageSize);

    res.status(200).json({
      msg: "Hiển thị danh sách loại món thành công",
      data: danhsachloaimon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy danh sách loại món" });
  }
};
// kich hoat loai mon
const kichhoatloaimonapi = async (req, res) => {
  try {
    const id = req.params.id;
    const kichhoat = await Loaimon.model.findOneAndUpdate(
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
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi kích hoạt loaimon", error: error });
  }
};
// Delete
const deleteloaimonApi = async (req, res) => {
  try {
    const trangThai = 0;
    await Loaimon.model.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting loaimon", error: error });
  }
};
// Sua
const updateloaimonApi = async (req, res) => {
  try {
    const updatedLoaimon = await Loaimon.model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLoaimon) {
      return res.status(404).json({ message: "Loại món không tồn tại" });
    }
    res.status(200).json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật loại món", error: error });
  }
};
//Api
const loaimonApi = async (req, res, next) => {
  res.end(JSON.stringify(await addloaimonApi(req, res, next)));
};
module.exports = {
  //Api
  loaimonApi,
  getchitietloaiMonApi,
  deleteloaimonApi,
  updateloaimonApi,
  kichhoatloaimonapi,
  getloaimonApi,
};
