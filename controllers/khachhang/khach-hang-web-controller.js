//Website
const getList =  async (req, res, next)=>{
    res.render("khachhang/danh-sach", {
        admin: req.session.ten,
        msg: ""
    })
}

module.exports = {
    getList
}