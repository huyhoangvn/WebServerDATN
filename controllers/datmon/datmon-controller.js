const { model: MonDat } = require("../../model/MonDat");

// Thêm mới món đặt
const addMonDat = async (req, res, next) => {
    try {
        if (!req.body || !req.body.idHD || !req.body.idMon || !req.body.giaTienDat || !req.body.soLuong) {
            throw new Error("Thông tin món đặt không đầy đủ hoặc không hợp lệ.");
        }
        const newMonDat = new MonDat(req.body);

        const savedMonDat = await newMonDat.save();

        if (!savedMonDat) {
            throw new Error("lưu món đặt không thành công");
        }

        res.status(200).json({
            dataSave: savedMonDat,
            msg: "món đặt đã được thêm thành công",
        });
    } catch (e) {
        console.error(e);
        res
            .status(500)
            .json({ error: e.message || "Đã xảy ra lỗi khi thêm món đặt" });
    }
}

// Lấy tất cả món đặt
const getAllMonDat = async (req, res, next) => {
    try {
        const monDats = await MonDat.find();
        res.status(200).json(monDats);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách món đặt", error });
    }
};

// Xóa món đặt
const deleteMonDatApi = async (req, res) => {
    try {
        await MonDat.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Xóa món đặt thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa món đặt", error });
    }
};

// Cập nhật món đặt
const updateMonDatApi = async (req, res) => {
    try {
        const updatedMonDat = await MonDat.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMonDat) {
            return res.status(404).json({ message: "Món đặt không tồn tại" });
        }
        res.status(200).json({ message: "Cập nhật món đặt thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật món đặt", error });
    }
};
const MonDatApi = async (req, res, next) => {
    res.end(JSON.stringify(await addMonDat(req, res, next)));
};
const getDanhSachMonDatByIdHoaDonApi = async (req, res, next) => {
    try {
        const idHoaDon = req.params.id; // Lấy ID của khách hàng từ tham số trong đường dẫn

        // Kiểm tra tính hợp lệ của ID khách hàng
        if (!idHoaDon) {
            return res.status(400).json({ msg: 'Vui lòng cung cấp ID hóa đơn' });
        }

        // Lấy danh sách hóa đơn của khách hàng dựa trên ID
        const danhSachMonDat = await MonDat.find({ idHD: idHoaDon });

        // Trả về danh sách hóa đơn
        res.json({ data: danhSachMonDat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn của món đặt', error: error.message });
    }
};
// Export các hàm API
module.exports = {
    MonDatApi,
    getAllMonDat,
    deleteMonDatApi,
    updateMonDatApi,
    getDanhSachMonDatByIdHoaDonApi,
};