var express = require('express');
var router = express.Router();
const nhanvienbanController = require('../../../controllers/nhanvien/nhanvienban-controller');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/',nhanvienbanController.addNhanVien);

router.put('/:id',nhanvienbanController.updateNhanVien)

router.delete('/:id',nhanvienbanController.deleteNhanVien);

module.exports = router;