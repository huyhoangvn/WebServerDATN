const KhachHang = require('../../model/KhachHang')

//Module
const dangKy = async(req, res, next)=>{
    let msg = ""
    const taiKhoan = req.body.taiKhoan
    const tenKH = req.body.tenKH
    const matKhau = req.body.matKhau
  
   
    
    //Validate khách hàng
    
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
        trangThai: 1
    })
    .then((response)=>{
        msg = "Thêm mới tài khoản người dùng thành công"
    })
    .catch((err)=>{
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
        if (!taiKhoan || !matKhau) {
            return res.status(400).json({ successMessage: 'Vui lòng nhập tài khoản và mật khẩu.' });
        }

        const khachHang = await KhachHang.model.findOne({ taiKhoan });

        if (!khachHang) {
            return res.status(401).json({ successMessage: 'Tài khoản không tồn tại.' });
        }

        if (matKhau !== khachHang.matKhau) {
            return res.status(401).json({ successMessage: 'Mật khẩu không đúng.' });
        }

        return res.status(200).json({ successMessage: 'Đăng nhập thành công.', khachHang });
    } catch (error) {
        console.error(error);
        res.status(500).json({ successMessage: 'Lỗi server.' });
    }
}

//lấy danh sách khách hàng

const getKhachHang = async (req,res) => {
    try {
      const khachHang = await KhachHang.model.find();
      res.json(khachHang);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //sửa thông tin khách hàng

  const updateKhachHang = async (req, res ) => {
    try{
      const data = await KhachHang.model.findByIdAndUpdate(req.params.id, req.body, {new: true})
      if(!data){
        return res.status(404).json({msg: "Cập nhật thông tin khách hàng thất bại!"})
  
      }else{
        return res.status(200).json({message: "Cập nhật thông tin khách hàng thành công!"})
  
      }
    }catch(err){
      return res.status(500).json({message: err.message})
    }
  }

  //xóa khách hàng
 const deleteKhachHang = async (req,res) => {
    try{
      const data =  await KhachHang.model.findByIdAndDelete(req.params.id)
      if(!data){
        return res.status(404).json({message: "Xóa khách hàng thất bại !"})
      }else{
        return res.status(200).json({message: "Xóa khách hàng thành công !"})
      }
    }catch(err){
      return res.status(500).json({message: err.message})
  
    }
  }



//Api
const dangKyApi = async(req, res, next)=>{
    res.end(JSON.stringify(await dangKy(req, res, next)))
}

module.exports = {
    //Api
    dangKyApi,
    dangNhap,
    getKhachHang,
    updateKhachHang,
    deleteKhachHang,
}