const { model: GioHang } = require("../../model/GioHang");
const { model: KhachHang } = require("../../model/KhachHang");
const { model: mon } = require("../../model/Mon");
const mongo = require('mongoose');


//thêm giỏ hàng
const addGioHang = async (req, res, next) => {
  let msg = "";
  const idKH = req.params.idKH;
  const idMon = req.body.idMon;

  // Kiểm tra xem món đã tồn tại trong giỏ hàng của khách hàng chưa
  let foundGioHang = await GioHang.findOne({ idMon });

  if (foundGioHang) {
    return res.json({
      msg: "Món đã tồn tại trong giỏ hàng"
    });
  }

  const list = await GioHang
    .create({
      idKH: idKH,
      idMon: idMon,
      trangThai: 1
    })

  return res.json({
    index: list,
    success: true,
    msg: msg
  });
};

//lấy danh sách giỏ hàng
const getAllGioHang = async (req, res) => {
  const idKH = new mongo.Types.ObjectId(req.params.idKH);

  const trang = parseInt(req.query.trang) || 1; // Trang hiện tại, mặc định là trang 1 nếu không có truy vấn currentPage
  const itemsPerPage = 10; // Số lượng mục trên mỗi trang

  try {
    const gioHangList = await GioHang.aggregate([
      {
        $match: { idKH: idKH } // Lọc theo idKH
      },
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
          idCH: "$mon.idCH",
          giaTien: "$mon.giaTien",
          tenMon: "$mon.tenMon",
          tenCH: "$cuaHang.tenCH",
          tenLM: "$loaiMon.tenLM",
          hinhAnh: { $concat: [req.protocol, "://", req.get("host"), "/public/images/", "$mon.hinhAnh"] }


        }
      },
      {
        $skip: (trang - 1) * trang
      },
      {
        $limit: itemsPerPage
      },

    ]);

    // Tính toán tổng số trang
    const totalCount = gioHangList.length;
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // Lấy danh sách giỏ hàng cho trang hiện tại

    return {
      list: gioHangList,
      trang,
      totalPages,
      totalCount,
      success: true,
      msg: "Thành công"
    };
  } catch (error) {
    return { msg: "Lỗi khi lấy danh sách giỏ hàng", error };
  }
};

//lấy giỏ hàng thông qua id
const getGioHangByUserIdApi = async (req, res) => {
  try {
    const { idKH } = req.params;
    const khachHang = await KhachHang.findById(idKH);
    if (!khachHang || !khachHang.trangThai) {
      return res.json({ msg: 'Khách hàng không tồn tại hoặc không hoạt động', success: false });
    }

    const gioHangList = await GioHang.find({ idKH });
    return res.json({
      list: gioHangList,
      success: true,
      msg: "lấy danh sách thành công"
    });
  } catch (error) {
    res.json({ message: "Lỗi khi lấy giỏ hàng của khách hàng", error });
  }
};

//xóa cứng giỏ hàng
const deleteGioHang = async (req, res) => {
  try {
    const id = req.params.id;
    let foundGioHang = await GioHang.findOne({ _id: id });

    if (!foundGioHang) {
      return {
        msg: "giỏ hàng không tồn tại",
        success: true,
      };
    }

    await GioHang.findByIdAndDelete(id);
    return res.json({
      index: true,
      success: true,
      msg: "Xóa giỏ hàng thành công"
    });
  } catch (error) {
    return ({
      msg: "Lỗi khi xóa giỏ hàng", error
    });
  }
};

const kiemTraGioHang = async (req, res) => {
  try {
    const idMon = req.body.idMon;
    const idKH = req.params.idKH;

    // Kiểm tra xem giỏ hàng của khách hàng có món hàng có idMon không
    const gioHang = await GioHang.findOne({
      idKH: idKH,
      idMon: idMon,
      trangThai: true // Chỉ kiểm tra các giỏ hàng có trạng thái là true
    });

    if (gioHang) {
      return res.json({ index: true, success: true, message: 'Món hàng đã có trong giỏ hàng của khách hàng' });
    } else {
      return res.json({ index: false, success: false, message: 'Món hàng không tồn tại trong giỏ hàng của khách hàng hoặc giỏ hàng không ở trạng thái true' });
    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Lỗi khi kiểm tra giỏ hàng' });
  }
};



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
      res.json({ msg: 'Đã xảy ra lỗi khi update Hóa đơn', error: error.message });
    } else {
      console.error("Tiêu đề đã được gửi đi rồi. Không thể gửi phản hồi lỗi.");
    }
  }
}






module.exports = {
  addGioHang,
  deleteGioHang,
  getAllGioHangApi,
  getGioHangByUserIdApi,
  kiemTraGioHang
};
