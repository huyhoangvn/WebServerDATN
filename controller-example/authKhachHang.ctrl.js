const KhachHang = require('../model/KhachHang')
const auth = require('../config/auth/jwt-encode')

//Module
const dangKy = async(req, res, next)=>{
    let msg = ""
    const taiKhoan = req.body.taiKhoan
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
        matKhau: matKhau,
        trangThai: 1
    })
    .then((response)=>{
        msg = "Thêm mới tài khoản người dùng thành công"
        return {
            index: response.id,
            success: true,
            msg: msg
        }
    })
    .catch((err)=>{
        msg = "Thêm mới tài khoản người dùng thất bại"
    })

    return {
        success: false,
        msg: msg
    }
}

const dangNhap = async(req, res, next)=>{
    let msg = ""
    const taiKhoan = req.body.taiKhoan
    const matKhau = req.body.matKhau
    
    //Validate khách hàng

    let foundKhachHang = await KhachHang.model.findOne({
        taiKhoan: taiKhoan
    })

    //Nếu người dùng tồn tại
    if(foundKhachHang){
        let loginResult = await KhachHang.model.findOne({
            taiKhoan: taiKhoan,
            matKhau: matKhau
        }) 
        //Nếu đăng nhập thành công
        if(loginResult){
            success = true,
            msg = "Đăng nhập thành công"
            return {
                index: loginResult.id,
                success: success,
                msg: msg
            }
        } else {
            msg = "Đăng nhập thất bại"
        }
    } else {
        msg = "Tài khoản không tồn tại"
    }

    return {
        success: false,
        msg: msg
    }
}

const layDanhSach = async(req, res, next) => {
    return {
        success: true,
        msg: "Thành công"
    }
}

//Api
const dangKyApi = async(req, res, next)=>{
    result = await dangKy(req, res, next)
    if(result.success){
        let token = auth.encodedToken(result.id)
        req.setHeader('Authorization', token)
        req.session.token = token
    }
    res.json(result)
}

const dangNhapApi = async(req, res, next)=>{
    result = await dangNhap(req, res, next)
    if(result.success){
        let token = auth.encodedToken(result.id)
        res.setHeader('Authorization', token)
        req.session.token = token
    }
    res.json(result)
}

const layDanhSachApi = async(req, res, next)=>{
    console.log(req.headers.authorization)
    res.json((await layDanhSach(req, res, next)))
}

module.exports = {
    //Api
    dangKyApi,
    dangNhapApi,
    layDanhSachApi
}