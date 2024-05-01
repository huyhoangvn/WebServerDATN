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
router.post('/',  loaimonCtrl.addloaimonApi);
// get all 
router.get('/:idLM',  loaimonCtrl.getchitietloaiMonApi);
// get loai mon - tim ten loai mon
router.get('/',  loaimonCtrl.getloaimonApi);
// delete 
router.delete('/:idLM',  loaimonCtrl.deleteLoaiMonApi);

//sua 
router.put('/:idLM',  loaimonCtrl.updateLoaiMonApi);

router.post('/kich-hoat/:id',  loaimonCtrl.kichhoatLoaiMonapi);

module.exports = router;
