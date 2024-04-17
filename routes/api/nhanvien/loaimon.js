var express = require('express');
var router = express.Router();
const loaimonCtrl = require('../../../controllers/loaimon/loaimon-controller');
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
// add loai mon 
router.post('/', passport.authenticate('jwt', { session: false }), loaimonCtrl.addloaimonApi);
// get all 
router.get('/:idLM', passport.authenticate('jwt', { session: false }), loaimonCtrl.getchitietloaiMonApi);
// get loai mon - tim ten loai mon
router.get('/', passport.authenticate('jwt', { session: false }), loaimonCtrl.getloaimonApi);
// delete 
router.delete('/:idLM', passport.authenticate('jwt', { session: false }), loaimonCtrl.deleteLoaiMonApi);

//sua 
router.put('/:idLM', passport.authenticate('jwt', { session: false }), loaimonCtrl.updateLoaiMonApi);

router.post('/kich-hoat/:id', passport.authenticate('jwt', { session: false }), loaimonCtrl.kichhoatLoaiMonapi);

module.exports = router;
