const Loaimon = require("../../model/LoaiMon");
const Mon = require("../../model/Mon");
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
      return res.json({ msg: "Loại món đã tồn tại", success: false });
    }
    if (req.body.tenLM.length > 100) {
      return res.json({ msg: "tên loại món vượt quá ký tự cho phép", success: false });
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
      res.json({ msg: "không tìm thấy loại món", success: false });
    }
    res.json(loaimon);
  } catch (error) {
    res.send(error);
  }
};
// get loai mon
// tìm kiếm tên http://localhost:3000/api/nhanvien/loaimon?ten=lợn
const getloaimonApi = async (req, res) => {
  try {
    const tenLM = req.query.tenLM;
    const trang = parseInt(req.query.trang) || 1;
    const timkiem1 = {
    };


    if (typeof (req.query.tenLM) !== 'undefined' && req.query.tenLM !== "") {
      timkiem1.tenLM = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    const list = await Loaimon.model.aggregate([
      {
        $match: {
          "trangThai": true
        }
      },
      {
        $match:
          timkiem1,

      },

      {
        $skip: (trang - 1) * 10,
      },

      {
        $limit: 10,
      },
    ]);

    res.json({
      list,
      count: list.length,
      msg: 'Get đánh giá theo tên món thành công',
      success: true
    });
  } catch (error) {
    console.error(error);
    res.json({
      error: 'Lỗi khi lấy đánh giá theo tên món',
      msg: 'Lỗi khi lấy đánh giá theo tên món',
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
      return res.json({ msg: "Không tìm thấy loại món", success: false });
    }
    res.json({
      msg: "đã kích hoạt cửa hàng",
      data: kichhoat,
    });
  } catch (error) {
    res.json({ msg: "Lỗi kích hoạt loại món", error: error, success: false });
  }
};
// Delete
const deleteLoaiMon = async (req, res) => {
  const idLM = new mongo.Types.ObjectId(req.params.idLM);

  try {
    const filter = { _id: idLM }
    const update = { trangThai: false }
    const index = await Loaimon.model.findOneAndUpdate(filter, update, { new: true })

    if (!index) {
      return res.json({
        error: 'Không tìm thấy loại món để xóa',
        msg: 'Không tìm thấy loại món để xóa',
        success: false
      });
    } else {
      res.json({
        index,
        msg: 'Xóa loại món thành công',
        success: true
      });
    }
  } catch (error) {
    res.json({
      error: 'Lỗi khi xóa loại món',
      msg: 'Lỗi khi xóa loại món',
      success: false
    });
  }
};

const deleteLoaiMonWeb = async (req, res) => {
  try {
    const idLM = new mongo.Types.ObjectId(req.params.idLM)
    const filter = { _id: idLM }
    const filterLM = await Mon.model.findOne({ idLM: idLM })
    let monSua = {}
    if (filterLM) {
      return ({ alert: "Đang tồn tại món hoạt động !" });
    }
    const loaiMonTim = await Loaimon.model.findOne({ _id: idLM })
    if (loaiMonTim.trangThai == true) {
      const update = { trangThai: false }
      const data = await Loaimon.model.findOneAndUpdate(filter, update, { new: true })
      monSua = data
    }
    if (loaiMonTim.trangThai == false) {
      const update = { trangThai: true }
      const data = await Loaimon.model.findOneAndUpdate(filter, update, { new: true })
      monSua = data
    }

    if (!monSua) {
      return ({ msg: "Xóa món thất bại !", success: false }); // Phản hồi 404 nếu không tìm thấy món
    } else {
      return ({ msg: "Xóa món thành công !", success: true }); // Phản hồi 200 nếu thành công
    }

  } catch (err) {
    return ({ msg: err.message, success: false }); // Phản hồi 500 nếu có lỗi xảy ra
  }
}
// Sua
const updateLoaiMon = async (req, res) => {
  const idLM = req.params.idLM;
  const tenLM = req.body.tenLM;
  const trangThai = req.body.trangThai;
  try {
    const filter = { _id: idLM };
    const update = { tenLM: tenLM, trangThai: trangThai };
    const updatedLoaiMon = await Loaimon.model.findOneAndUpdate(filter, update, { new: true });

    if (!updatedLoaiMon) {
      return res.json({
        error: 'Không tìm thấy loại món để sửa',
        msg: 'Không tìm thấy loại món để sửa',
        success: false
      });
    } else if (tenLM === '' || tenLM.length > 50) {
      return res.json({
        error: 'Sửa loại món không thành công do thiếu thông tin  hoặc vượt quá ký tự cho phép',
        error: 'Sửa loại món không thành công do thiếu thông tin  hoặc vượt quá ký tự cho phép',
        success: false
      });
    } else {
      res.json({
        data: updatedLoaiMon,
        msg: 'Sửa loại món thành công',
        success: true
      });
    }
  } catch (error) {
    res.json({
      error: 'Lỗi khi sửa loại món: ' + error.msg,
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
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi thêm loại món",
        error: error.msg,
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
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi xóa loại món",
        error: error.msg,
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
      res.json({
        success: false,
        msg: "Đã xảy ra lỗi khi thêm loại món",
        error: error.msg,
      });
    } else {
      console.error(
        "Headers have already been sent. Cannot send error response."
      );
    }
  }
};

const GetSoLuongMonTheoLoaiMon = async (req, res) => {
  try {
    const timkiem = {};
    const trang = parseInt(req.query.trang) || 1;

    if (typeof (req.query.tenLM) !== 'undefined' && typeof (req.query.tenLM) !== "") {
      timkiem.tenLM = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if (trangThaiValue === 1 || trangThaiValue === 0) {
        timkiem.trangThai = trangThaiValue === 1;
      }
    }

    const result = await Loaimon.model.aggregate([
      { $match: timkiem },
      {
        $lookup: {
          from: "Mon",
          localField: "_id",
          foreignField: "idLM",
          as: "monData"
        }
      },
      {
        $project: {
          "idLM": "$_id",
          "tenLM": "$tenLM",
          "trangThai": "$trangThai",
          "soLuongMon": { $size: "$monData" } // Đếm số lượng phần tử trong mảng "monData"
        }
      },
      {
          $skip: (trang-1)*10,
      },

      {
              $limit: 10,
      },
    ]);

    return ({
      list: result,
      msg: 'lấy số lượng món thành công',
    });
  } catch (error) {
    return ({
      msg: 'Lỗi khi lấy số lượng món theo loại món',
      success: false
    });
  }
}

const GetSoLuongLoaiMon = async (req, res) => {
  try {
    const timkiem = {};

    if (typeof (req.query.tenLM) !== 'undefined' && typeof (req.query.tenLM) !== "") {
      timkiem.tenLM = { $regex: req.query.tenLM, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if (trangThaiValue === 1 || trangThaiValue === 0) {
        timkiem.trangThai = trangThaiValue === 1;
      }
    }

    const result = await Loaimon.model.aggregate([
      { $match: timkiem },
      {
        $lookup: {
          from: "Mon",
          localField: "_id",
          foreignField: "idLM",
          as: "monData"
        }
      },
      {
        $project: {
          "idLM": "$_id",
          "tenLM": "$tenLM",
          "trangThai": "$trangThai",
          "soLuongMon": { $size: "$monData" } // Đếm số lượng phần tử trong mảng "monData"
        }
      },
      {
        $count: "count",
      }


    ]);

    return ({
      count: result[0].count,
      msg: 'lấy số lượng món thành công',
    });
  } catch (error) {
    return ({
      msg: 'Lỗi khi lấy số lượng món theo loại món',
      success: false
    });
  }
}
module.exports = {
  //Api
  addloaimonApi,
  getchitietloaiMonApi,
  deleteLoaiMonApi,
  updateLoaiMonApi,
  kichhoatLoaiMonapi,
  getloaimonApi,
  themLoaiMon,
  GetSoLuongMonTheoLoaiMon,
  deleteLoaiMonWeb,
  GetSoLuongLoaiMon
};
