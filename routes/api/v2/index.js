const express = require("express")
const router = express.Router();
const dummyController = require("../../../controllers/api/v2/dummy")
router.get("/", dummyController.dummy)
module.exports = router