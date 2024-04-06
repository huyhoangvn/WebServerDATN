var express = require('express');
const VerificationControllers = require('../../../controllers/khachhang/verification.controller');
var router = express.Router();

/* GET users listing. */
router.post('/', VerificationControllers.verification);

module.exports = router;
