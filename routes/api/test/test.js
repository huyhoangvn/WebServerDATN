var express = require('express');
var router = express.Router();
const { testValidation } = require('./test.validation');
const testController = require('../../../controllers/test/test.controller')
const { preSaveMiddleware } = require('../../../middleware/email.middleware');
const { preCheckCodeMiddleware } = require('../../../middleware/code');
const validate = require('../../../middleware/validate'); // Điều chỉnh đường dẫn tùy theo cấu trúc thư mục của bạn



router.post('/verification', testController.verification);

router.post('/sms', testController.sendSms);

module.exports = router;