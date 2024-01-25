
const createView = async function (req, res) {
    try {
       return  res.render('index', { title: 'Express' });
    } catch (error) {
        return res.status(500).end(JSON.stringify({ message: "Đã xảy ra lỗi không mong muốn" }));
    }
}

module.exports = {
    createView
}
