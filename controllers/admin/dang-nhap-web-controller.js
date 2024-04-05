const Admin = require('../../model/Admin')
const auth = require('../../config/auth/jwt-encode')
const ThongKeCtrl = require("../../controllers/thongke/thong-ke-controller");

const dangNhap = async(req, res, next)=>{
    let msg = ""
    let index = {}
    let success = false
    //Validate
    if (!req.body || !req.body.taiKhoan || !req.body.matKhau) {
        return {
            success: false,
            msg: "Thiếu thông tin tài khoản hoặc mật khẩu"
        };
    }
    const taiKhoan = req.body.taiKhoan.toString().trim()
    const matKhau = req.body.matKhau.toString().trim()

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
    if(matKhau.length < 6 || matKhau.length > 50){
        return {
            success: false,
            msg: "Mật khẩu có chiều dài từ 6-50 ký tự"
        }
    }

    let foundKhachHang = await Admin.model.findOne({
        taiKhoan: taiKhoan
    })

    //Nếu người dùng tồn tại
    if(foundKhachHang){
        let loginResult = await Admin.model.aggregate([
            {
                $match: {
                    taiKhoan: taiKhoan,
                    matKhau: matKhau,
                    trangThai: 1
                }
            }
        ]);        
        console.log(loginResult.length)
        if(loginResult.length > 0){
            success = true,
            index = {
                id: loginResult.id,
                ten: loginResult.ten
            }
            msg = "Đăng nhập thành công"
            return {
                index : index,
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
        index : index,
        success: success,
        msg: msg
    }
}

//Website
const dangNhapWeb = async(req, res, next)=>{
    result = await dangNhap(req, res, next)
    .then(async(result)=>{
        if(result.success){
            let token = auth.encodedToken(result.index.id)
            req.session.token = token
            req.session.ten = result.index.ten
            res.redirect("thong-ke/doanh-thu")
        } else {
            res.render("index", {
                msg: result.msg
            })
        }
    })
}

const getViewThongKeDoanhThuWeb =  async (req, res, next)=>{
    res.render("thongke/doanh-thu", {
        admin: req.session.ten,
        msg: ""
    })
}

const getViewDangNhapWeb = async (req, res, next)=>{
    res.render("index");
}

const dangXuatWeb = async (req, res, next)=>{
    req.session.token = ""
    req.session.ten = "N/A"
    res.render("index")
}

module.exports = {
    //Api
    dangNhapWeb,
    dangXuatWeb,
    getViewDangNhapWeb,
    getViewThongKeDoanhThuWeb
}