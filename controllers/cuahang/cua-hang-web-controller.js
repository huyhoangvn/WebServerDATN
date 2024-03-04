//Website
const getList =  async (req, res, next)=>{
    res.render("cuahang/danh-sach", {
        admin: req.session.ten,
        msg: ""
    })
}

const getAdd =  async (req, res, next)=>{
    res.render("cuahang/them-moi", {
        admin: req.session.ten,
        msg: ""
    })
}

module.exports = {
    getList,
    getAdd
}