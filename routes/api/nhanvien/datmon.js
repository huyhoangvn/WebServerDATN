var express = require('express');
var router = express.Router();
const datmonCtrl = require('../../../controllers/datmon/datmon-controller')
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
// add loai mon 
router.post('/', datmonCtrl.MonDatApi);
// get all 
router.get('/', datmonCtrl.getAllMonDat);
// delete 
router.delete('/:id', datmonCtrl.deleteMonDatApi);

//sua 
router.put('/:id', datmonCtrl.updateMonDatApi);

module.exports = router;


