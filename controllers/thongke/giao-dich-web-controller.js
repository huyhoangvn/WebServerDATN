//Website
const getView = async (req, res, next) => {
    res.render("thongke/giao-dich", {
        admin: req.session.ten,
        msg: ""
    })
}

module.exports = {
    getView
}