const KhachHang = require('../database/KhachHang')

//Module
const dangKy = async(req, res, next)=>{
    let msg = ""
    const taiKhoan = req.body.taiKhoan
    const matKhau = req.body.matKhau
    
    //Validate

    let foundKhachHang = await KhachHang.model.findOne({
        taiKhoan: taiKhoan
    })
    if(foundKhachHang){
        return { msg: "Khách hàng đã tồn tại" }
    }

    await KhachHang.model.create({
        taiKhoan: taiKhoan,
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



//Api
const dangKyApi = async(req, res, next)=>{
    res.end(JSON.stringify(await dangKy(req, res, next)))
}

module.exports = {
    //Api
    dangKyApi,
}