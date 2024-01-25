var express = require('express');
var router = express.Router();

const {createView} = require('../../controllers/admin/index-controller')
// đăng nhập
router.get('/', createView)

//Duyệt tài khoản nhân viên quản lý cửa hàng
module.exports = router;











