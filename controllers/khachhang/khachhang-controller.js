const { request } = require('express')
const KhachHang = require('../../model/KhachHang')
const mongo = require('mongoose');

//Module
const dangKy = async (req, res, next) => {
  let msg = "";
  const taiKhoan = req.body.taiKhoan.toString().trim();
  const tenKH = req.body.tenKH.toString().trim();
  const matKhau = req.body.matKhau.toString().trim();

  // Validate khách hàng
  if (taiKhoan === "") {
    return res.json({
      success: false,
      msg: "Tài khoản không được để trống"
    });
  }
  if (matKhau === "") {
    return res.json({
      success: false,
      msg: "Mật khẩu không được để trống"
    });
  }

  try {
    let foundKhachHang = await KhachHang.model.findOne({ taiKhoan: taiKhoan });
    if (foundKhachHang) {
      return res.json({ success: false, msg: "Khách hàng đã tồn tại" });
    }

    await KhachHang.model.create({
      taiKhoan: taiKhoan,
      tenKH: tenKH,
      matKhau: matKhau,
      trangThai: true
    });

    msg = "Thêm mới tài khoản người dùng thành công";
    return res.json({ success: true, msg: msg });
  } catch (error) {
    msg = "Thêm mới tài khoản người dùng thất bại";
    return res.json({ success: false, msg: msg });
  }
};

//đăng nhập

const dangNhap = async (req, res) => {
  try {
    const { taiKhoan, matKhau } = req.body;
    // if (!taiKhoan || !matKhau) {
    //     return res.status(400).json({ successMessage: 'Vui lòng nhập tài khoản và mật khẩu.' });
    // }
    if (taiKhoan == "") {
      return {
        success: false,
        msg: "Tài khoản không được để trống"
      }
    }
    if (matKhau == "") {
      return {
        success: false,
        msg: "Mật khẩu không được để trống"
      }
    }

    const khachHang = await KhachHang.model.findOne({ taiKhoan });

    if (!khachHang) {
      return res.json({
        success: false,
        successMessage: 'Tài khoản không tồn tại.'
      });
    }

    if (matKhau !== khachHang.matKhau) {
      return res.json({
        success: false,
        message: 'Mật khẩu không đúng.'
      });
    }

    return res.json({
      success: true,
      successMessage: 'Đăng nhập thành công.', khachHang
    });
  } catch (error) {
    console.error(error);
    res.json({ successMessage: 'Lỗi server.' });
  }
}

//lấy danh sách theo tên khách hàng
//chỉ hiển thị tên KH và giới tính, không hiển thị những thông tin nhạy cảm như email, sđt, địa chỉ, tài khoản, mật khẩu
const getKhachHangTheoTen = async (req, res) => {

  try {
    // const tenKH = req.query.tenKH;
    const trang = parseInt(req.query.trang) || 1;
    const timkiem = {};

    //tìm kiếm theo tên khách hàng
    if (typeof (req.query.tenKH) !== 'undefined' && req.query.tenKH !== "") {

      timkiem.tenKH = { $regex: req.query.tenKH, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }

    if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if (trangThaiValue === 1 || trangThaiValue === 0) {
        timkiem.trangThai = trangThaiValue === 1;
      }
    }

    //tìm kiếm theo giới tính của khách hàng
    // Kiểm tra xem có yêu cầu tìm kiếm theo giới tính không và giới tính không rỗng
    if (typeof (req.query.gioiTinh) !== 'undefined' && !isNaN(parseInt(req.query.gioiTinh))) {
      const gioiTinhValue = parseInt(req.query.gioiTinh);
      if (gioiTinhValue === 1 || gioiTinhValue === 0) {
        timkiem.gioiTinh = gioiTinhValue === 1;
      }
    }

    const list = await KhachHang.model.find(
      // Điều kiện tìm kiếm chỉ khi có điều kiện được định nghĩa
      timkiem,
      {
        "tenKH": "$tenKH",
        "gioiTinh": "$gioiTinh",
        "taiKhoan": "$taiKhoan",
        "trangThai": "$trangThai"
      }
    )
      .skip((trang - 1) * 10)
      .limit(10);


    return {
      list,
      count: list.length,
      message: 'Get danh sách  theo tên khách hàng thành công',
      success: true,
    };
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Lỗi khi lấy danh sách theo tên khách hàng',
      success: false
    });
  }
}

const getSoLuongKhachHang = async (req, res) => {

  try {
    // const tenKH = req.query.tenKH;
    const trang = parseInt(req.query.trang) || 1;
    const timkiem = {};

    //tìm kiếm theo tên khách hàng
    if (typeof (req.query.tenKH) !== 'undefined' && req.query.tenKH !== "") {

      timkiem.tenKH = { $regex: req.query.tenKH, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
    }

    if (typeof (req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if (trangThaiValue === 1 || trangThaiValue === 0) {
        timkiem.trangThai = trangThaiValue === 1;
      }
    }

    //tìm kiếm theo giới tính của khách hàng
    // Kiểm tra xem có yêu cầu tìm kiếm theo giới tính không và giới tính không rỗng
    if (typeof (req.query.gioiTinh) !== 'undefined' && !isNaN(parseInt(req.query.gioiTinh))) {
      const gioiTinhValue = parseInt(req.query.gioiTinh);
      if (gioiTinhValue === 1 || gioiTinhValue === 0) {
        timkiem.gioiTinh = gioiTinhValue === 1;
      }
    }

    const count = await KhachHang.model.countDocuments(timkiem);


    return {
      count: count,
      message: ' thành công',
      success: true
    };
  } catch (error) {
    console.error(error);
    return {
      error: 'Lỗi ',
      success: false
    };
  }
}

const getKhachHangbyidKhachHang = async (req, res) => {
  try {
    const id = new mongo.Types.ObjectId(req.params.id);
    const khachHang = await KhachHang.model.findById(id);

    if (!khachHang) {
      return res.json({
        success: false,
        msg: 'Không tìm thấy khách hàng',
      });
    }

    res.json({
      index: khachHang,
      success: true,
      msg: 'Thành công',
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      msg: 'Đã xảy ra lỗi',
    });
  }
};


const updateMatKhau = async (req, res, next) => {
  try {
    const id = req.params.id;
    const matKhauCu = req.body.matKhauCu;
    const matKhauMoi = req.body.matKhauMoi;

    // Kiểm tra trường matKhauMoi có tồn tại hay không
    if (!matKhauMoi) {
      return res.json({
        success: false,
        msg: "Vui lòng cung cấp mật khẩu mới.",
      });
    }

    const item = await KhachHang.model.findById(id);
    if (!item) {
      return res.json({ success: false, msg: "Không tìm thấy khách hàng" });
    }

    // Kiểm tra mật khẩu cũ
    if (matKhauCu !== item.matKhau) {
      return res.json({ success: false, msg: "Mật khẩu cũ không chính xác." });
    }

    // Cập nhật mật khẩu mới
    item.matKhau = matKhauMoi;
    const savedKhachHang = await item.save();

    res.json({
      success: true,
      msg: "Mật khẩu đã được cập nhật thành công.",
      index: savedKhachHang,
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, msg: "Đã xảy ra lỗi khi đổi mật khẩu" });
  }
};


//sửa thông tin khách hàng
const updateKhachHang = async (req, res) => {
  try {
    const idKH = new mongo.Types.ObjectId(req.params.idKH);
    const tenKH = req.body.tenKH;
    const diaChi = req.body.diaChi;
    const sdt = req.body.sdt;
    const gioiTinh = req.body.gioiTinh;
    const hinhAnh = req.body.hinhAnh || "default-avatar.png";

    const hinhAnhLink = `${req.protocol}://${req.get("host")}/public/images/${hinhAnh}`

    const filter = { _id: idKH }
    const update = {
      tenKH: tenKH,
      diaChi: diaChi,
      sdt: sdt,
      gioiTinh: gioiTinh,
      hinhAnh: hinhAnhLink,
    }
    const index = await KhachHang.model.findOneAndUpdate(filter, update, { new: true })
    if (!index) {
      return res.json({
        msg: 'Không tìm thấy khách hàng để sửa',
        success: false
      });
    } else if (tenKH == "" || diaChi == "" || sdt == "" || gioiTinh == "" || hinhAnh == "") {
      return res.json({
        msg: 'cập nhật thông tin khách hàng lỗi do thiếu thông tin',
        success: false
      });
    } else {
      return res.json({
        index,
        msg: 'cập nhật thông tin khách hàng thành công',
        success: true
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      msg: 'Lỗi khi cập nhật thông tin khách hàng',
      success: false
    });
  }
}

const finAccount = async (req, res) => {
  try {
    const email = req.params.email;
    if(email == ""){
      return res.json({
        error: 'Email không được để trống',
        success: false
      });
    }
    const khachHang = await KhachHang.model.findOne({ taiKhoan: email});
    if (!khachHang) {
      return res.json({
        error: 'Tài khoản không tồn tại',
        success: false
      });
    }
    return res.json({
      message: "Tìm tài khoản thành công",
      success: true,
      id: khachHang._id
    });
  } catch (error) {
    console.error(error);
    return res.json({
      error: "Lỗi khi tìm tài khoản",
      success: false
    });
  }
}



//xóa mềm tài khoản khách hàng
const softDeleteKhachHang = async (req, res) => {
  try {
    await KhachHang.model.findByIdAndUpdate(req.params.id, { trangThai: false }); //sửa trạng thái 0
    res.json({
      message: "Xóa mềm khách hàng thành công",
      success: true
    });
  } catch (error) {
    res.json({
      error: "Lỗi khi xóa mềm khách hàng",
      success: false
    });
  }
};


//xóa khách hàng
const deleteKhachHang = async (req, res) => {
  try {
    const data = await KhachHang.model.findByIdAndDelete(req.params.id)
    if (!data) {
      return res.json({
        error: "Xóa khách hàng thất bại !",
        success: false
      })
    } else {
      return {
        message: "Xóa khách hàng thành công !",
        success: true
      }
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })

  }
}

const deleteKhachHangWeb = async (req, res) => {
  try {
    const idKH = new mongo.Types.ObjectId(req.params.idKH)
    const filter = { _id: idKH }
    const khachHangTim = await KhachHang.model.findOne({ _id: idKH })
    let khachHangSua = {}
    if (khachHangTim.trangThai == true) {
      const update = { trangThai: false }
      const data = await KhachHang.model.findOneAndUpdate(filter, update, { new: true })
      khachHangSua = data
    } else {
      const update = { trangThai: true }
      const data = await KhachHang.model.findOneAndUpdate(filter, update, { new: true })
      khachHangSua = data
    }

    if (!khachHangSua) {
      return ({
        error: "Xóa khách hàng thất bại !",
        success: false
      })
    } else {
      return {
        message: "Xóa khách hàng thành công !",
        success: true
      }
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })

  }
}


function removeCircular(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  });
}


//Api
const dangKyApi = async (req, res, next) => {
  try {
    const result = await dangKy(req, res, next);

    const jsonResult = removeCircular(result);

    res.end(JSON.stringify(jsonResult));
  } catch (error) {
    console.error(error);
    res.json({ success: false, msg: "Có lỗi xảy ra trong quá trình xử lý" });
  }
};


const getKhachHangTheoTenApi = async (req, res) => {
  const result = await getKhachHangTheoTen(req, res);
  res.json(result)
}

const getSoLuongKhachHangApi = async (req, res) => {
  const result = await getSoLuongKhachHang(req, res);
  res.json(result)
}


module.exports = {
  dangKy,
  dangKyApi,
  dangNhap,
  getKhachHangTheoTen,
  getKhachHangTheoTenApi,
  updateKhachHang,
  deleteKhachHang,
  deleteKhachHangWeb,
  getSoLuongKhachHang,
  getSoLuongKhachHangApi,
  getKhachHangbyidKhachHang,
  updateMatKhau,
  finAccount
}
