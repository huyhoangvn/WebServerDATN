var express = require("express");
var router = express.Router();
const hinhanhmonCtrl = require("../../../controllers/hinhanhmon/hinhanhmon-controller");

/* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });

router.post("/", hinhanhmonCtrl.addHinhAnhMonApi);

router.delete("/:id", hinhanhmonCtrl.deletehinhanhmonApi);

router.post("/kich-hoat/:id", hinhanhmonCtrl.kichhoathinhanhmonApi);

router.get("/", hinhanhmonCtrl.gethinhanhmonApi); // tìm kiếm theo idMon

module.exports = router;
