var express = require('express');
var router = express.Router();
const loaimonCtrl = require('../../../controllers/loaimon/loaimon-controller')
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
// add loai mon 
router.post('/',loaimonCtrl.loaimonApi);
// get all 
router.get('/',loaimonCtrl.getAllloaiMon);
// delete 
router.delete('/:id',loaimonCtrl.deleteloaimonApi);

//sua 
router.put('/:id',loaimonCtrl.updateloaimonApi);
module.exports = router;
