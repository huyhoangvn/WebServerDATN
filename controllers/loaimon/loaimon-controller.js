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
const getAllloaiMon = async (req, res, next) => {
  try {
    const loaimon = await Loaimon.model.find();
    // if (!loaimon) {
    //   throw "Không tìm thấy loại món";
    // }
    res.status(200).json(loaimon);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete
const deleteloaimonApi = async (req, res) => {
  try {
    await Loaimon.model.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting loaimon", error: error });
  }
};
// Sua
const updateloaimonApi = async (req, res) => {
  try {
    const updatedLoaimon = await Loaimon.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLoaimon) {
      return res.status(404).json({ message: "Loại món không tồn tại" });
    }
    res.status(200).json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật loại món", error: error });
  }
};
//Api
const loaimonApi = async (req, res, next) => {
  res.end(JSON.stringify(await addloaimonApi(req, res, next)));
};
module.exports = {
  //Api
  loaimonApi,
  getAllloaiMon,
  deleteloaimonApi,
  updateloaimonApi
};