var express = require("express");
var router = express.Router();

const monCtrl = require('../../../controllers/mon/mon-controller')

/* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });
router.post("/", monCtrl.addmonapi);
router.get("/", monCtrl.getAllmonapi);

router.delete("/:id", monCtrl.deletemonapi);
router.put("/:id", monCtrl.updatemonapi);

module.exports = router;
