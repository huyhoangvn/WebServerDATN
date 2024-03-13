const { request } = require('express')
const KhachHang = require('../../model/KhachHang')

//Module
const dangKy = async(req, res, next)=>{
    let msg = ""
    const taiKhoan = req.body.taiKhoan.toString().trim()
    const tenKH = req.body.tenKH.toString().trim()
    const matKhau = req.body.matKhau.toString().trim()
  
   
    
    //Validate khách hàng
    if(taiKhoan == ""){
      return {
          success: false,
          msg: "Tài khoản không được để trống"
      }
  }
  if(matKhau == ""){
      return {
          success: false,
          msg: "Mật khẩu không được để trống"
      }
  }

    let foundKhachHang = await KhachHang.model.findOne({
        taiKhoan: taiKhoan
    })
    if(foundKhachHang){
        return { msg: "Khách hàng đã tồn tại" }
    }

    await KhachHang.model.create({
        taiKhoan: taiKhoan,
        tenKH: tenKH,
        matKhau: matKhau,
        trangThai: true
    })
    .then((response)=>{
      success: true, 
        msg = "Thêm mới tài khoản người dùng thành công"
     
    })
    .catch((err)=>{
      success: false,
        msg = "Thêm mới tài khoản người dùng thất bại"
    })

    return {
        msg: msg
    }
}

//đăng nhập

const dangNhap = async (req, res) => {
    try {
        const { taiKhoan, matKhau } = req.body;
        // if (!taiKhoan || !matKhau) {
        //     return res.status(400).json({ successMessage: 'Vui lòng nhập tài khoản và mật khẩu.' });
        // }
        if(taiKhoan == ""){
          return {
              success: false,
              msg: "Tài khoản không được để trống"
          }
      }
      if(matKhau == ""){
          return {
              success: false,
              msg: "Mật khẩu không được để trống"
          }
      }

        const khachHang = await KhachHang.model.findOne({ taiKhoan });

        if (!khachHang) {
            return res.status(401).json({
              success:false, 
              successMessage: 'Tài khoản không tồn tại.' });
        }

        if (matKhau !== khachHang.matKhau) {
            return res.status(401).json({ 
              success:false,
              message: 'Mật khẩu không đúng.' });
        }

        return res.status(200).json({ 
          success: true,
          successMessage: 'Đăng nhập thành công.', khachHang });
    } catch (error) {
        console.error(error);
        res.status(500).json({ successMessage: 'Lỗi server.' });
    }
}



  //lấy danh sách theo tên khách hàng
  //chỉ hiển thị tên KH và giới tính, không hiển thị những thông tin nhạy cảm như email, sđt, địa chỉ, tài khoản, mật khẩu
const getKhachHangTheoTen = async (req, res)=>{

  try {
    // const tenKH = req.query.tenKH;
    const trang = parseInt( req.query.trang ) || 1;
    const timkiem = {};

    //tìm kiếm theo tên khách hàng
    if (typeof(req.query.tenKH) !== 'undefined' && req.query.tenKH !== "" ) {
    
      timkiem.tenKH = { $regex: req.query.tenKH, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
     }
    
     if (typeof(req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if(trangThaiValue === 1 || trangThaiValue === 0){
        timkiem.trangThai = trangThaiValue === 1;
      }
     }

     //tìm kiếm theo giới tính của khách hàng
     // Kiểm tra xem có yêu cầu tìm kiếm theo giới tính không và giới tính không rỗng
     if (typeof(req.query.gioiTinh) !== 'undefined' && !isNaN(parseInt(req.query.gioiTinh))) {
      const gioiTinhValue = parseInt(req.query.gioiTinh);
      if(gioiTinhValue === 1 || gioiTinhValue === 0){
        timkiem.gioiTinh = gioiTinhValue === 1;
      }
     }
    

      // const list = await KhachHang.model.aggregate([
      //     {$match: {
    
      //            timkiem,
      //     }},
      //     {$project : {
      //        // "taiKhoan": "$KetQuaKhachHang.taiKhoan",
      //       //  "matKhau":"$KetQuaKhachHang.matKhau",
      //         "tenKH" : "$tenKH",
      //         "gioiTinh" : "$gioiTinh", 
      //        // "hinhAnh": "$KetQuaKhachHang.hinhAnh",
      //       //  "diaChi": "$KetQuaKhachHang.diaChi",
      //       //  "sdt": "$KetQuaKhachHang.sdt",
      //       //  "trangThai": "$KetQuaKhachHang.trangThai"
              
      //     }},
      //     {
      //       //Bỏ qua các bản ghi trước trang được chỉ định
      //         $skip: (trang-1)*10,
      //     },
      //     {
      //         $limit: 10,
      //     },
      // ]);
      const list = await KhachHang.model.find(
        // Điều kiện tìm kiếm chỉ khi có điều kiện được định nghĩa
                     timkiem,  
        { 
          "tenKH" : "$tenKH",
          "gioiTinh" : "$gioiTinh", 
          "trangThai": "$trangThai"
        }
      )
      .skip((trang - 1) * 10)
      .limit(10);
  

      res.status(200).json({
          list,
          count:list.length,
          message: 'Get danh sách  theo tên khách hàng thành công',
          success: true
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'Lỗi khi lấy danh sách theo tên khách hàng',
          success: false
      });
  }
}

const getSoLuongKhachHang = async (req, res)=>{

  try {
    // const tenKH = req.query.tenKH;
    const trang = parseInt( req.query.trang ) || 1;
    const timkiem = {};

    //tìm kiếm theo tên khách hàng
    if (typeof(req.query.tenKH) !== 'undefined' && req.query.tenKH !== "" ) {
     
      timkiem.tenKH = { $regex: req.query.tenKH, $options: 'i' }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
     }
    
     if (typeof(req.query.trangThai) !== 'undefined' && !isNaN(parseInt(req.query.trangThai))) {
      const trangThaiValue = parseInt(req.query.trangThai);
      if(trangThaiValue === 1 || trangThaiValue === 0){
        timkiem.trangThai = trangThaiValue === 1;
      }
     }

     //tìm kiếm theo giới tính của khách hàng
     // Kiểm tra xem có yêu cầu tìm kiếm theo giới tính không và giới tính không rỗng
     if (typeof(req.query.gioiTinh) !== 'undefined' && !isNaN(parseInt(req.query.gioiTinh))) {
      const gioiTinhValue = parseInt(req.query.gioiTinh);
      if(gioiTinhValue === 1 || gioiTinhValue === 0){
        timkiem.gioiTinh = gioiTinhValue === 1;
      }
     }
    
     const count = await KhachHang.model.countDocuments(timkiem);
  

      return{
          count:count,
          message: ' thành công',
          success: true
      };
  } catch (error) {
      console.error(error);
      return{
          error: 'Lỗi ',
          success: false
      };
  }
}


  //sửa thông tin khách hàng
  const updateKhachHang = async (req, res ) => {
    try{
      const data = await KhachHang.model.findByIdAndUpdate(req.params.id, req.body, {new: true})
      if(!data){
        return res.status(404).json({
          msg: "Cập nhật thông tin khách hàng thất bại!",
          success:true
        })
  
      }else{
        return res.status(200).json({
          error: "Cập nhật thông tin khách hàng thành công!",
          success:false
        })
  
      }
    }catch(err){
      return res.status(500).json({message: err.message})
    }
  }


  //xóa mềm tài khoản khách hàng
const softDeleteKhachHang = async (req, res) => {
  try {
    await KhachHang.model.findByIdAndUpdate(req.params.id, { trangThai: false }); //sửa trạng thái 0
    res.status(200).json({ 
        message: "Xóa mềm khách hàng thành công",
        success: true
       });
  } catch (error) {
    res.status(500).json({ 
        error: "Lỗi khi xóa mềm khách hàng", 
        success:false
       });
  }
};
  

  //xóa khách hàng
 const deleteKhachHang = async (req,res) => {
    try{
      const data =  await KhachHang.model.findByIdAndDelete(req.params.id)
      if(!data){
        return res.status(404).json({
          error: "Xóa khách hàng thất bại !",
          success:false
        })
      }else{
        return {
          message: "Xóa khách hàng thành công !",
          success:true
      }}
    }catch(err){
      return res.status(500).json({message: err.message})
  
    }
  }



//Api
const dangKyApi = async(req, res, next)=>{
    res.end(JSON.stringify(await dangKy(req, res, next)))
}

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
    getSoLuongKhachHang,
    getSoLuongKhachHangApi
}
