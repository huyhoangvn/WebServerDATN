var express = require('express');
var router = express.Router();
const datmonCtrl = require('../../../controllers/datmon/datmon-controller');
const passportConfig = require('../../../config/auth/jwt-decode-nhanvien')
const passport = require('passport')

// add loai mon 
// router.post('/them/:idHD', datmonCtrl.addMonDatApi);
// get mon dat theo id hoa don 
router.get('/:id', passport.authenticate('jwt', { session: false }), datmonCtrl.getDanhSachMonDatByIdHoaDonApi);
// delete cung
// router.delete('/:id', datmonCtrl.deleteMonDatApi);
// // delete mem
// router.post('/:id', datmonCtrl.deleteMonDatMemApi);
// //sua 
// router.put('/:id', datmonCtrl.updateMonDatApi);

module.exports = router;


