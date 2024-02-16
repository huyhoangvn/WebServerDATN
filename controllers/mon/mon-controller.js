const Mon = require("../../model/Mon");

const addmonapi = async (req, res, next) => {
  let msg = "";
  const { idLM, idNV, tenMon, giaTien } = req.body;

  // Validate món
  let foundMon = await Mon.model.findOne({ idLM, idNV, tenMon, giaTien });
  if (foundMon) {
    return res.status(400).json({ msg: "Món  đã tồn tại" });
  }

  await Mon.model
    .create({
      idLM,
      idNV,
      tenMon,
      giaTien,
    })
    .then((response) => {
      msg = "Thêm mới loại món thành công";
    })
    .catch(() => {
      msg = "Thêm mới món đặt thất bại";
    });

  return {
    msg: msg,
  };
};

const getAllmonapi = async (req, res) => {
  try {
    const newmon = await Mon.model.find();
    res.status(500).json(newmon);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách món", error: error });
  }
};
const getAnmonapi = async (req, res) => {
  try {
    const mon = await Mon.model.findById(req.params.id).populate("");
  } catch (error) {}
};
const deletemonapi = async (req, res) => {
  try {
    await Mon.model.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xóa món thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa món đặt", error });
  }
};
const updatemonapi = async (req, res) => {
  try {
    const updatemon = await Mon.model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatemon) {
      return res.status(404).json({ message: " Món không tồn tại" });
    }
    res.status(200).json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật loại món", error: error });
  }
};
module.exports = {
  //Api
  addmonapi,
  getAllmonapi,
  deletemonapi,
  updatemonapi,
};
