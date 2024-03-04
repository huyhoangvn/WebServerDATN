//Website
const getList =  async (req, res, next)=>{
    res.render("cuahang/danh-sach-quan-ly", {
        admin: req.session.ten,
        msg: ""
    })
}

module.exports = {
    getList
}