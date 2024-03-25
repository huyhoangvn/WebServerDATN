const Loaimon = require("../../model/LoaiMon");
const mongo = require("mongoose");

const themLoaiMon = async (req, res, next) => {
  let msg = "";
  const tenLM = req.body.tenLM;

  try {
    // Kiểm tra xem loại món đã tồn tại chưa
    let foundLoaiMon = await Loaimon.model.findOne({
      tenLM: tenLM,
    });

    if (foundLoaiMon) {
      throw new Error("Loại món đã tồn tại");
    }

    // Tạo mới loại món
    await Loaimon.model.create({
      tenLM: tenLM,
      trangThai: 1,
    });

    msg = "Thêm mới loại món thành công";
  } catch (error) {
    msg = "Thêm mới loại món thất bại";
    console.error(error); // In lỗi ra console để dễ debug
  }

  return {
    msg: msg,
    success: true
  };
};
// Get All
const getchitietloaiMonApi = async (req, res, next) => {
  try {
    const idLM = req.params.idLM;
    const loaimon = await Loaimon.model.findOne({ _id: idLM });
    if (!loaimon) {
      res.status(500).json({ error: "không tìm thấy loại món" });
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
const kichhoatLoaiMonapi = async (req, res) => {
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
const deleteLoaiMon = async (req, res) => {
  const idLM = new mongo.Types.ObjectId(req.params.idLM);

  try {
      const filter = {_id: idLM}
      const update = {trangThai : false}
      const index = await Loaimon.model.findOneAndUpdate(filter, update, { new: true })

      if (!index) {
          return res.json({
              error: 'Không tìm thấy loại món để xóa',
              success: false
          });
      }else{
          res.json({
              index,
              message: 'Xóa loại món thành công',
              success: true
          });
      }
  } catch (error) {
      res.json({
          error: 'Lỗi khi xóa loại món',
          success: false
      });
  }
};
// Sua
const updateLoaiMon = async (req, res) => {
  const idLM = req.params.idLM; 
  const tenLM = req.body.tenLM;
  const trangThai = req.body.trangThai;
  try {
      const filter = { _id: idLM };
      const update = { tenLM: tenLM , trangThai: trangThai};
      const updatedLoaiMon = await Loaimon.model.findOneAndUpdate(filter, update, { new: true });

      if (!updatedLoaiMon) {
          return res.json({
              error: 'Không tìm thấy loại món để sửa',
              success: false
          });
      } else if (tenLM === '') {
          return res.json({
              error: 'Sửa loại món không thành công do thiếu thông tin',
              success: false
          });
      } else {
          res.json({
              data: updatedLoaiMon,
              message: 'Sửa loại món thành công',
              success: true
          });
      }
  } catch (error) {
      res.json({
          error: 'Lỗi khi sửa loại món: ' + error.message,
          success: false
      });
  }
};
//Api
const addloaimonApi = async (req, res, next) => {
  try {
    const result = await themLoaiMon(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        msg: "Đã xảy ra lỗi khi thêm loại món",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const deleteLoaiMonApi = async (req, res, next) => {
  try {
    const result = await deleteLoaiMon(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        msg: "Đã xảy ra lỗi khi xóa loại món",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
const updateLoaiMonApi = async (req, res, next) => {
  try {
    const result = await updateLoaiMon(req, res, next);
    if (!res.headersSent) {
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        msg: "Đã xảy ra lỗi khi thêm loại món",
        error: error.message,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};
module.exports = {
  //Api
  addloaimonApi,
  getchitietloaiMonApi,
  deleteLoaiMonApi,
  updateLoaiMonApi,
  kichhoatLoaiMonapi,
  getloaimonApi,
};
