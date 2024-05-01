var express = require('express');
const slideController = require('../../controllers/slide/slide.controller');
const router = express.Router();
const MulterConfigs = require("../../config/multer-config");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-admin')
const sessionAdmin = require('../../config/auth/session-admin')
/* GET users listing. */
router
.get('/', slideController.getList)
.post('/', MulterConfigs.upload.array('imageSlide', 1), slideController.addImage)
.post('/update/:id',MulterConfigs.upload.array('imageSlide', 1), slideController.updateSlide)
.post('/delete/:id',slideController.deleteSlide)


module.exports = router;
