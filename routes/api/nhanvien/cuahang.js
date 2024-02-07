var express = require('express');
const nhanvienbanController = require('../../../controllers/nhanvien/nhanvienban-controller');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/',nhanvienbanController.addNhanVien);

router.put('/:id',nhanvienbanController.updateNhanVien)

router.delete('/:id',nhanvienbanController.deleteNhanVien);

module.exports = router;
