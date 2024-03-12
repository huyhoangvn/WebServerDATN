const NhanVien = require('../../model/NhanVien')
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

    let foundKhachHang = await NhanVien.model.findOne({
        taiKhoan: taiKhoan
    })

    //Nếu người dùng tồn tại
    if(foundKhachHang){
        await NhanVien.model.findOne({
            taiKhoan: taiKhoan,
            matKhau: matKhau,
            trangThai: 1
        }).then((loginResult)=>{
            success = true,
            msg = "Đăng nhập thành công"
            index = {
                id: loginResult.id,
                tenNV: loginResult.tenNV,
                phanQuyen: loginResult.phanQuyen
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

const dangNhapApi = async (req, res, next) => {
    try {
        const result = await dangNhap(req, res, next);

        if (result.success) {
            const token = auth.encodedToken(result.index.id);

            // Set the Authorization header with the token
            res.setHeader('Authorization', token);

            // Send the response with user data and message
            res.status(200).json({
                index: result.index,
                msg: result.msg
            });
        } else {
            // If login fails, send JSON response with error message
            res.json({ msg: result.msg });
        }
    } catch (error) {
        // Handle errors appropriately
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

const dangXuatApi = async (req, res, next)=>{

}

module.exports = {
    //Api
    dangNhapApi
}