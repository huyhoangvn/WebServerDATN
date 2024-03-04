//Website
const getView =  async (req, res, next)=>{
    res.render("thongke/mon-ban-chay", {
        admin: req.session.ten,
        msg: ""
    })
}

module.exports = {
    getView
}