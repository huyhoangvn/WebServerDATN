//Website
const getView =  async (req, res, next)=>{
    res.render("thongke/doanh-thu", {
        admin: req.session.ten,
        msg: ""
    })
}

module.exports = {
    getView
}