var express = require('express');
var router = express.Router();

const datmonCtrl = require('../../../controllers/datmon/datmon-controller')
const passportConfig = require('../../../config/auth/jwt-decode-khachhang')
const passport = require('passport')
/* GET users listing. */
// router.post('/them/:idHD', passport.authenticate('jwt', { session: false }), datmonCtrl.addMonDatApi);
// get mon dat theo id hoa don 
router.get('/:id', passport.authenticate('jwt', { session: false }), datmonCtrl.getDanhSachMonDatByIdHoaDonApi);
// delete cung
// router.delete('/:id', datmonCtrl.deleteMonDatApi);

// //sua 
// router.put('/:id', datmonCtrl.updateMonDatApi);

router.post('/them', passport.authenticate('jwt', { session: false }), datmonCtrl.addHoaDonVaMonDat);
module.exports = router;