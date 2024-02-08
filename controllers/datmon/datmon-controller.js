const MonDat = require("../../model/MonDat");

// Thêm mới món đặt
const addMonDatApi = async (req, res, next) => {
    let msg = "";
    const { idHD, idMon, soLuong } = req.body;

    // Validate món đặt
    let foundMonDat = await MonDat.model.findOne({ idHD, idMon });
    if (foundMonDat) {
        return res.status(400).json({ msg: "Món đặt đã tồn tại" });
    }

    await MonDat.model
        .create({
            idHD,
            idMon,
            soLuong,
        })
        .then(() => {
            msg = "Thêm mới món đặt thành công";
        })
        .catch(() => {
            msg = "Thêm mới món đặt thất bại";
        });

    return {
        msg: msg,
    };
};

// Lấy tất cả món đặt
const getAllMonDat = async (req, res, next) => {
    try {
        const monDats = await MonDat.model.find();
        res.status(200).json(monDats);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách món đặt", error });
    }
};

// Xóa món đặt
const deleteMonDatApi = async (req, res, next) => {
    try {
        await MonDat.model.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Xóa món đặt thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa món đặt", error });
    }
};

// Cập nhật món đặt
const updateMonDatApi = async (req, res, next) => {
    try {
        const updatedMonDat = await MonDat.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMonDat) {
            return res.status(404).json({ message: "Món đặt không tồn tại" });
        }
        res.status(200).json({ message: "Cập nhật món đặt thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật món đặt", error });
    }
};
const MonDatApi = async (req, res, next) => {
    res.end(JSON.stringify(await addMonDatApi(req, res, next)));
};
// Export các hàm API
module.exports = {
    MonDatApi,
    getAllMonDat,
    deleteMonDatApi,
    updateMonDatApi,
};