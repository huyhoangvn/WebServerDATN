const fs = require("fs");
const path = require("path");
const { model: Slide } = require("../../model/Slide");
const { model: CuaHang } = require("../../model/CuaHang");
const { model: Mon } = require("../../model/Mon");
const mongo = require("mongoose");

const { sl } = require("date-fns/locale");

// Helper function to fetch data from the database
const fetchData = async () => {
  const [dataStore, dataSlide] = await Promise.all([
    CuaHang.find(),
    Slide.find()
      .populate({
        path: "idCH",
        select: "tenCH",
      })
      .populate({
        path: "idMon",
        select: "tenMon",
      }),
  ]);

  return { dataStore, dataSlide };
};

// Helper function to handle file upload
const handleFileUpload = (req) => {
  if (req.files && req.files.length > 0) {
    return req.files[0].filename;
  }
  return null;
};

// Helper function to delete image file
const deleteImageFile = (imagePath) => {
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    console.log("Đã xóa ảnh thành công");
  } else {
    console.log("Không tìm thấy ảnh để xóa");
  }
};

const slideController = {
  addImage: async (req, res, next) => {
    try {
      const { idStore, idDish, imageSlide } = req.body;

      // Kiểm tra số lượng mục hiện có
      const countSlides = await Slide.countDocuments({ idCH: idStore });

      if (countSlides >= 5) {
        // Nếu đã đạt tới giới hạn 5 mục, trả về thông báo lỗi
        const { dataStore, dataSlide } = await fetchData();
        return res.render("slide/slide", {
          dataStore,
          dataSlide,
          error: "Chỉ được thêm tối đa 5 mục",
        });
      }

      let image = imageSlide || handleFileUpload(req);

      if (!image) {
        const { dataStore, dataSlide } = await fetchData();
        return res.render("slide/slide", {
          dataStore,
          dataSlide,
          error: "Vui lòng chọn ảnh",
        });
      }

      const newSlide = new Slide({
        idCH: idStore,
        idMon: idDish,
        imgSlide: image,
      });
      await newSlide.save();

      const { dataStore, dataSlide } = await fetchData();
      res.render("slide/slide", { dataStore, dataSlide });
    } catch (e) {
      console.error(e);
      res.json({ success: false, msg: e });
    }
  },

  getList: async (req, res, next) => {
    try {
      const { dataStore, dataSlide } = await fetchData();
      res.render("slide/slide", { dataStore, dataSlide });
    } catch (e) {
      console.error(e);
      res.json({ success: false, msg: e });
    }
  },

  deleteSlide: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await Slide.findByIdAndDelete(id);
      const imagePath = path.resolve(
        __dirname,
        "../../public/images/",
        data.imgSlide
      );
      deleteImageFile(imagePath);

      const { dataStore, dataSlide } = await fetchData();
      res.render("slide/slide", { dataStore, dataSlide });
    } catch (e) {
      console.error(e);
      res.json({ success: false, msg: e });
    }
  },

  updateSlide: async (req, res, next) => {
    try {
      const { id } = req.params;
      const image = handleFileUpload(req);

      if (!image) {
        const { dataStore, dataSlide } = await fetchData();
        return res.render("slide/slide", {
          dataStore,
          dataSlide,
          error: "Vui lòng chọn ảnh",
        });
      }

      const data = await Slide.findById(id);
      const imagePath = path.resolve(
        __dirname,
        "../../public/images/",
        data.imgSlide
      );
      deleteImageFile(imagePath);

      await Slide.findByIdAndUpdate(id, { imgSlide: image }, { new: true });

      const { dataStore, dataSlide } = await fetchData();
      res.render("slide/slide", { dataStore, dataSlide });
    } catch (e) {
      console.error(e);
      res.status(500).render("error", { error: e.message });
    }
  },
  getImageSlide: async (req, res, next) => {
    try {
      const slides = await Slide.find();

      // Thay đổi đường dẫn hình ảnh của mỗi slide
      const modifiedSlides = slides.map((slide) => {
        return {
          ...slide.toObject(),
          imgSlide: `${req.protocol}://${req.get("host")}/public/images/${
            slide.imgSlide
          }`,
        };
      });
      res.json({ success: true, data: modifiedSlides });
    } catch (error) {
      console.error(error);
      res.json({ success: false, msg: "Lỗi khi lấy danh sách slide", error });
    }
  },

  getMonCuaCuaHang: async (req, res) => {
    try {
      const idCH = new mongo.Types.ObjectId(req.params.idCH);

      const trangThai = req.params.trangThai;
      const trang = parseInt(req.query.trang) || 1;
      const timkiem = {};
      let giaTienMin = 0;
      let giaTienMax = 100000;
      if (typeof req.query.tenMon !== "undefined" && req.query.tenMon !== "") {
        timkiem.tenMon = { $regex: req.query.tenMon, $options: "i" }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
      }
      if (typeof req.query.tenCH !== "undefined" && req.query.tenCH !== "") {
        timkiem["KetQuaCuaHang.tenCH"] = {
          $regex: req.query.tenCH,
          $options: "i",
        }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
      }
      if (typeof req.query.tenLM !== "undefined" && req.query.tenLM !== "") {
        timkiem["KetQuaCuaHang.tenLM"] = {
          $regex: req.query.tenLM,
          $options: "i",
        }; // Thêm $options: 'i' để tìm kiếm không phân biệt chữ hoa, chữ thường
      }
      if (
        typeof req.query.trangThai !== "undefined" &&
        !isNaN(parseInt(req.query.trangThai))
      ) {
        const trangThaiValue = parseInt(req.query.trangThai);
        if (trangThaiValue === 1 || trangThaiValue === 0) {
          timkiem.trangThai = trangThaiValue === 1;
        }
      }
      if (
        typeof req.query.giaTienMin !== "undefined" &&
        !isNaN(parseInt(req.query.giaTienMin))
      ) {
        giaTienMin = parseInt(req.query.giaTienMin);
      }
      if (
        typeof req.query.giaTienMax !== "undefined" &&
        !isNaN(parseInt(req.query.giaTienMax))
      ) {
        giaTienMax = parseInt(req.query.giaTienMax);
      }

      const list = await Mon.aggregate([
        {
          $lookup: {
            from: "CuaHang",
            localField: "idCH",
            foreignField: "_id",
            as: "KetQuaCuaHang",
          },
        },
        {
          $lookup: {
            from: "LoaiMon",
            localField: "idLM",
            foreignField: "_id",
            as: "KetQuaLoaiMon",
          },
        },
        {
          $match: {
            idCH: idCH,
          },
        },
        {
          $match: timkiem,
        },

        {
          $unwind: {
            path: "$KetQuaCuaHang",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $unwind: {
            path: "$KetQuaLoaiMon",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            tenMon: "$tenMon",
            giaTien: "$giaTien",
            trangThai: "$trangThai",
            tenCH: "$KetQuaCuaHang.tenCH", // Thay vì "$tenCH"
            tenLM: "$KetQuaLoaiMon.tenLM",
            idMon: "$idMON",
            hinhAnh: {
              $concat: [
                req.protocol + "://",
                req.get("host"),
                "/public/images/",
                "$hinhAnh",
              ],
            },
          },
        },
        {
          $match: {
            giaTien: {
              $gte: giaTienMin,
              $lte: giaTienMax,
            },
          },
        },
        {
          $skip: (trang - 1) * 10,
        },
        {
          $limit: 10,
        },
      ]);

      res.json({
        count: list.length,
        list: list,
        msg: "Get món của cửa hàng thành công",
        success: true,
      });
    } catch (error) {
      res.json({
        msg: "Lỗi khi lấy món của cửa hàng",
        success: false,
      });
    }
  },
};

module.exports = slideController;
