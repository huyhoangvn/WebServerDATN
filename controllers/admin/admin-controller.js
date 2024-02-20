const Admin = require('../../model/Admin')
const auth = require('../../config/auth/jwt-encode')

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
        let loginResult = await Admin.model.findOne({
            taiKhoan: taiKhoan,
            // matKhau: matKhau,
            // trangThai: 1
        }).then((loginResult)=>{
            success = true,
            msg = "Đăng nhập thành công"
            index = {
                id: loginResult.id,
                ten: loginResult.ten
            }
        })
        .catch((e)=>{
            msg = "Đăng nhập thất bại"
        })
    } else {
        msg = "Tài khoản không tồn tại"
    }

    return {
        index : index,
        success: success,
        msg: msg
    }
}

const getThongTin = async(req, res, next)=>{
    try{
        const id = req.user._id
        let admin = await Admin.model.findOne({
            _id: id
        })
        if(admin){
            index = {
                ten: admin.ten
            }
            return {
                index: index,
                success: true,
                msg: "Lấy dữ liệu thành công"
            }
        }
        return {
            success: false,
            msg: "Không lấy được dữ liệu từ tài khoản hiện tại"
        }
    } catch(error) {
        return {
            error: error,
            success: false,
            msg: "Có lỗi trong quá trình xác thực tài khoản"
        }
    }
}

//Website
const dangNhapWeb = async(req, res, next)=>{
    result = await dangNhap(req, res, next)
    .then((result)=>{
        console.log(result.success)
        if(result.success){
            let token = auth.encodedToken(result.index.id)
            req.session.token = token
            res.render("thongke/doanhthu", {
                index: result.index.ten,
                msg: result.msg
            })
        } else {
            res.render("index", {
                msg: result.msg
            })
        }
    })
}

const getViewThongKeDoanhThuWeb =  async (req, res, next)=>{
    result = await getThongTin(req, res, next)
    if(result.success){
        res.render("thongke/doanhthu", {
            index: result.index.ten,
            msg: result.msg
        })
    } 
    res.render("thongke/doanhthu", {
        index: "N/A",
        msg: result.msg
    })
}

const getViewDangNhapWeb = async (req, res, next)=>{
    res.render("index");
}

const dangXuatWeb = async (req, res, next)=>{
    req.session.token = ""
    res.render("index")
}

module.exports = {
    //Api
    dangNhapWeb,
    dangXuatWeb,
    getViewDangNhapWeb,
    getViewThongKeDoanhThuWeb
}