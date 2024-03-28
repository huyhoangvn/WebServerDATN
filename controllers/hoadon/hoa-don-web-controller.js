const getList = async (req, res, next) => {
    res.render("hoadon/danh-sach", {
        admin: req.session.ten,
        msg: ""
    })
}

const getChiTiet = async (req, res, next) => {
    res.render("hoadon/chi-tiet", {
        admin: req.session.ten,
        msg: ""
    })
}

module.exports = {
    getList,
    getChiTiet
}