var express = require('express');
var router = express.Router();
const hoadonctrl = require('../../../controllers/hoadon/hoadon-controller')
/* GET users listing. */
router.post('/', hoadonctrl.addHoaDonApi);
// get all 
router.get('/', hoadonctrl.getAllHoaDon);
// delete 
router.delete('/:id', hoadonctrl.deleteHoaDonApi);
//update
router.put('/:id', hoadonctrl.updateHoaDonApi);

module.exports = router;