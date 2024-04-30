var express = require('express');
const slideController = require('../../controllers/slide/slide.controller');
const router = express.Router();
const MulterConfigs = require("../../config/multer-config");
const passport = require('passport')
const passportConfig = require('../../config/auth/jwt-decode-admin')
const sessionAdmin = require('../../config/auth/session-admin')
/* GET users listing. */
router
.get('/',sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), slideController.getList)
.post('/',sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }),MulterConfigs.upload.array('imageSlide', 1), slideController.addImage)
.post('/update/:id',sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }),MulterConfigs.upload.array('imageSlide', 1), slideController.updateSlide)
.post('/delete/:id',sessionAdmin.setTokenHeader, passport.authenticate('jwt', { session: false }), slideController.deleteSlide)


module.exports = router;
