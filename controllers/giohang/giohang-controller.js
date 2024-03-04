const GioHang = require("../../model/GioHang");


//thêm giỏ hàng
const addGioHangApi = async (req, res, next) => {
  let msg = "";
  const { idKH, idMon } = req.body;

  // Kiểm tra xem món đã tồn tại trong giỏ hàng của khách hàng chưa
  let foundGioHang = await GioHang.model.findOne({ idKH, idMon });

  if (foundGioHang) {
    return res.status(400).json({ 
        msg: "Món đã tồn tại trong giỏ hàng" });
  }

  await GioHang.model
    .create({
      idKH:idKH,
      idMon:idMon,
      trangThai: 1
    })
    .then((response) => {
      msg = "Thêm món vào giỏ hàng thành công";
    })
    .catch(() => {
      msg = "Thêm món vào giỏ hàng thất bại";
    });

  return res.status(200).json({ 
    // index: response.id,
    success: true,
    msg:msg });
};

//cập nhật giỏ hàng
const updateGioHangApi = async (req, res) => {
  try {
    const { idKH } = req.body;

    // Kiểm tra xem khách hàng có tồn tại trong giỏ hàng không
    let existingUser = await GioHang.model.findOne({ idKH });

    if (!existingUser) {
      return res.status(404).json({ 
        message: "Khách hàng không tồn tại trong giỏ hàng" });
    }

    // Cập nhật thông tin giỏ hàng của người dùng
    await GioHang.model.findOneAndUpdate(
      { idKH },
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({ 
        message: "Cập nhật giỏ hàng thành công" });
  } catch (error) {
    res.status(500).json({ 
        message: "Lỗi khi cập nhật giỏ hàng", error });
  }
};


//xóa mềm giỏ hàng
const softDeleteGioHangApi = async (req, res) => {
  try {
    await GioHang.model.findByIdAndUpdate(req.params.id, { trangThai: 0 });
    res.status(200).json({ 
        message: "Xóa mềm giỏ hàng thành công" });
  } catch (error) {
    res.status(500).json({ 
        message: "Lỗi khi xóa mềm giỏ hàng", error });
  }
};

//xóa cứng giỏ hàng
const deleteGioHangApi = async (req, res) => {
  try {
    await GioHang.model.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
        message: "Xóa giỏ hàng thành công" });
  } catch (error) {
    res.status(500).json({ 
        message: "Lỗi khi xóa giỏ hàng", error });
  }
};

//lấy danh sách giỏ hàng
const getAllGioHangApi = async (req, res) => {
  try {
    const gioHangList = await GioHang.model.find();
    res.status(200).json(gioHangList);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách giỏ hàng", error });
  }
};

//lấy giỏ hàng thông qua id
const getGioHangByUserIdApi = async (req, res) => {
  try {
    const { idKH } = req.params;
    const gioHangList = await GioHang.model.find({ idKH });
    res.status(200).json(gioHangList);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy giỏ hàng của khách hàng", error });
  }
};

module.exports = {
  addGioHangApi,
  updateGioHangApi,
  softDeleteGioHangApi,
  deleteGioHangApi,
  getAllGioHangApi,
  getGioHangByUserIdApi,
};
