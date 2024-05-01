const fs = require("fs");
const path = require("path");
const { model: Slide } = require("../../model/Slide");
const { model: CuaHang } = require("../../model/CuaHang");
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
      const modifiedSlides = slides.map(slide => {
        return {
          ...slide.toObject(),
          imgSlide: `${req.protocol}://${req.get("host")}/public/images/${slide.imgSlide}`
        };
      });

      res.json({ success: true, data: modifiedSlides });
    } catch (error) {
      console.error(error);
      res.json({ success: false, msg: "Lỗi khi lấy danh sách slide", error });
    }
  }
};

module.exports = slideController;
