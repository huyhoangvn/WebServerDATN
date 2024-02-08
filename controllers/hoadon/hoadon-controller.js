const HoaDon = require("../../model/HoaDon"); // Thay đổi đường dẫn nếu cần

// Thêm mới hóa đơn
const addHoaDonApi = async (req, res, next) => {
    let msg = "";
    // Validate hóa đơn
    try {
        // const foundHoaDon = await HoaDon.model.findOne({ idKH, idNV });
        // if (foundHoaDon) {
        //     return res.status(400).json({ msg: "Hóa đơn đã tồn tại" });
        // }

        // Tạo hóa đơn mới
        const newHoaDon = new HoaDon(req.body);

        const saveHoaDon = await newHoaDon.save();

        if (!saveHoaDon) {
            throw new Error("Lưu hóa đơn không thành công.");
        }

        res.status(200).json({
            dataSave: saveHoaDon,
            msg: "Hóa đơn đã được thêm thành công.",
        });
    } catch (e) {
        console.error(e);
        res
            .status(500)
            .json({ error: e.message || "Đã xảy ra lỗi khi thêm hóa đơn" });
    };
};

// Lấy tất cả hóa đơn
const getAllHoaDon = async (req, res, next) => {
    try {
        const hoaDonList = await HoaDon.model.find();
        res.status(200).json(hoaDonList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Lỗi khi lấy danh sách hóa đơn" });
    }
};

// Xóa hóa đơn
const deleteHoaDonApi = async (req, res) => {
    try {
        await HoaDon.model.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Xóa hóa đơn thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi xóa hóa đơn", error });
    }
};

// Cập nhật thông tin hóa đơn
const updateHoaDonApi = async (req, res) => {
    try {
        const updatedHoaDon = await HoaDon.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedHoaDon) {
            return res.status(404).json({ message: "Hóa đơn không tồn tại" });
        }
        res.status(200).json({ message: "Cập nhật hóa đơn thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi cập nhật hóa đơn", error });
    }
};

// Export các hàm API
module.exports = {
    addHoaDonApi,
    getAllHoaDon,
    deleteHoaDonApi,
    updateHoaDonApi,
};
