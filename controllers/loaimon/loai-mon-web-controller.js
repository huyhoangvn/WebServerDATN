//Website
const getList =  async (req, res, next)=>{
    res.render("mon/loai-mon", {
        admin: req.session.ten,
        msg: ""
    })
}

module.exports = {
    getList
}