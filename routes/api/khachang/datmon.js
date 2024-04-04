var express = require('express');
var router = express.Router();

const datmonCtrl = require('../../../controllers/datmon/datmon-controller')
/* GET users listing. */
router.post('/them/:idHD', datmonCtrl.addMonDatApi);
// get mon dat theo id hoa don 
router.get('/:id', datmonCtrl.getDanhSachMonDatByIdHoaDonApi);
// delete cung
router.delete('/:id', datmonCtrl.deleteMonDatApi);

//sua 
router.put('/:id', datmonCtrl.updateMonDatApi);

module.exports = router;