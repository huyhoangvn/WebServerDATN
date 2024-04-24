var express = require('express');
var router = express.Router();
const thanhToanController = require('../../../controllers/thanhtoan/thanhtoan.controller')

router.get('/', ()=>{
    res.send("Hi")
})

router.post('/payZalo/:idHD', thanhToanController.paymentZalo);

// router.post('/result/:idHD', thanhToanController.testCallBack);

module.exports = router;