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
    const idLM = req.params.idLM;
    const loaimon = await Loaimon.model.findOne({ _id: idLM });
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
    const tenLM = req.query.tenLM;
    const trang = parseInt( req.query.trang ) || 1;
    const timkiem1 = {
    };
  
    
     if (typeof(req.query.tenLM) !== 'undefined' && req.query.tenLM !== "") {
      timkiem1.tenLM = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
     }
     console.log(" tenLM = " +tenLM );
     const list = await Loaimon.model.aggregate([
       { $match:
        timkiem1,
        
       },

       {
            $skip: (trang-1)*10,
       },

       {
            $limit: 10,
       },
    ]);
     
      console.log(  list );
      res.status(200).json({
        list,
        count:list.length,
        message: 'Get đánh giá theo tên món thành công',
        success: true
    });
  } catch (error) {
       console.error(error);
       res.status(500).json({
        error: 'Lỗi khi lấy đánh giá theo tên món',
        success: false
    });
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
    res.status(500).json({ message: "Lỗi kích hoạt loại món", error: error });
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
