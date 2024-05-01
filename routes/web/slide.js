var express = require('express');
const slideController = require('../../controllers/slide/slide.controller');
const router = express.Router();
const MulterConfigs = require("../../config/multer-config");

/* GET users listing. */
router
.get('/', slideController.getList)
.post('/', MulterConfigs.upload.array('imageSlide', 1), slideController.addImage)
.post('/update/:id',MulterConfigs.upload.array('imageSlide', 1), slideController.updateSlide)
.post('/delete/:id',slideController.deleteSlide)
.get("/theo-cua-hang/:idCH",  slideController.getMonCuaCuaHang);

module.exports = router;
