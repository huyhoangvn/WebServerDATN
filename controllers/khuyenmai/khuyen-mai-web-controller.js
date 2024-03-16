//Website

const { getTatCaKhuyenMai } = require('../../controllers/khuyenmai/khuyenmai-controller');
const getList = async (req, res) => {
    try {
        const trang = parseInt(req.query.trang) || 1;
        const soLuongKhuyenMaiTrenTrang = 10;
        const soLuongKhuyenMai = await getTatCaKhuyenMai(req, res);
        const totalPages = Math.ceil(soLuongKhuyenMai.count / soLuongKhuyenMaiTrenTrang);
        const result = await getTatCaKhuyenMai(req, res);
        res.render("khuyenmai/danh-sach", {
            data: result.list,
            admin: req.session.ten,
            msg: result.list,
            totalPages: totalPages,
            currentPage: trang,
        });

    } catch (error) {
        console.error("Error fetching data:", error);

    }
}

const getAdd = async (req, res, next) => {
    res.render("khuyenmai/them-moi", {
        admin: req.session.ten,
        msg: ""
    })
}

module.exports = {
    getList,
    getAdd
}