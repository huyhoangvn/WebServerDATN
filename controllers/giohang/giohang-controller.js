const { model: GioHang } = require("../../model/GioHang");
const mongo = require('mongoose');


//thêm giỏ hàng
const addGioHang = async (req, res, next) => {
  let msg = "";
  const { idKH, idMon } = req.body;

  // Kiểm tra xem món đã tồn tại trong giỏ hàng của khách hàng chưa
  let foundGioHang = await GioHang.findOne({ idMon });

  if (foundGioHang) {
    return res.status(400).json({
      msg: "Món đã tồn tại trong giỏ hàng"
    });
  }

  await GioHang
    .create({
      idKH: idKH,
      idMon: idMon,
      trangThai: 1
    })
    .then((response) => {
      msg = "Thêm món vào giỏ hàng thành công";
    })
    .catch(() => {
      msg = "Thêm món vào giỏ hàng thất bại";
    });

  return {
    success: true,
    msg: msg
  };
};

//lấy danh sách giỏ hàng
const getAllGioHang = async (req, res) => {
  try {
    const gioHangList = await GioHang.aggregate([
      {
        $lookup: {
          from: "Mon",
          localField: "idMon",
          foreignField: "_id",
          as: "mon"
        }
      },
      {
        $unwind: "$mon"
      },
      {
        $lookup: {
          from: "CuaHang",
          localField: "mon.idCH",
          foreignField: "_id",
          as: "cuaHang"
        }
      },
      {
        $unwind: "$cuaHang"
      },
      {
        $lookup: {
          from: "LoaiMon",
          localField: "mon.idLM",
          foreignField: "_id",
          as: "loaiMon"
        }
      },
      {
        $unwind: "$loaiMon"
      },
      {
        $project: {
          _id: 1,
          idKH: 1,
          idMon: 1,
          giaTien: "$mon.giaTien",
          tenMon: "$mon.tenMon",
          tenCH: "$cuaHang.tenCH",
          tenLM: "$loaiMon.tenLM"
        }
      }
    ]);

    return {
      data: gioHangList,
      success: true,
      msg: "thành công"
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách giỏ hàng", error });
  }
};

//lấy giỏ hàng thông qua id
const getGioHangByUserIdApi = async (req, res) => {
  try {
    const { idKH } = req.params;
    const gioHangList = await GioHang.find({ idKH });
    res.status(200).json(gioHangList);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy giỏ hàng của khách hàng", error });
  }
};

//xóa cứng giỏ hàng
const deleteGioHang = async (req, res) => {
  try {
    await GioHang.findByIdAndDelete(req.params.id);
    return {
      success: true,
      message: "Xóa giỏ hàng thành công"
    };
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa giỏ hàng", error
    });
  }
};


const addGioHangApi = async (req, res, next) => {
  try {
    const result = await addGioHang(req, res, next);
    if (!res.headersSent) {
      // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    } else {
      console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi kết quả.");
    };
  } catch (error) {
    // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi lỗi
    if (!res.headersSent) {
      res.status(500).json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
    } else {
      console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
    }
  }
}
const deleteGioHangApi = async (req, res, next) => {
  try {
    const result = await deleteGioHang(req, res, next);
    if (!res.headersSent) {
      // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    } else {
      console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi kết quả.");
    };
  } catch (error) {
    // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi lỗi
    if (!res.headersSent) {
      res.status(500).json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
    } else {
      console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
    }
  }
}
const getAllGioHangApi = async (req, res, next) => {
  try {
    const result = await getAllGioHang(req, res, next);
    if (!res.headersSent) {
      // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi
      res.json(result); // Gửi kết quả trực tiếp mà không sử dụng JSON.stringify
    } else {
      console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi kết quả.");
    };
  } catch (error) {
    // Kiểm tra xem headers đã được gửi chưa trước khi gửi phản hồi lỗi
    if (!res.headersSent) {
      res.status(500).json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
    } else {
      console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
    }
  }
}






module.exports = {
  addGioHangApi,
  deleteGioHangApi,
  getAllGioHangApi,
  getGioHangByUserIdApi,
};
