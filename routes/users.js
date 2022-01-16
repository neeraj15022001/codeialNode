const express = require("express")
const router = express.Router();
const userController = require("../controllers/users_controller")
router.get("/profile", userController.profile)
router.get("/about", userController.about);
router.get("/login", userController.login);
router.get("/signup", userController.signup);
router.post("/create", userController.create)
router.post("/createSession", userController.createSession)
module.exports = router;