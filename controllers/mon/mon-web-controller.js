//Website
const getList =  async (req, res, next)=>{
    res.render("mon/danh-sach", {
        admin: req.session.ten,
        msg: ""
    })
}

module.exports = {
    getList
}