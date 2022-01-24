const express = require("express")
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users_controller")
router.get("/profile/:id", passport.checkAuthentication, userController.profile)
router.post("/update/:id", passport.checkAuthentication, userController.update)
router.get("/about", userController.about);
router.get("/login", userController.login);
router.get("/signup", userController.signup);
router.post("/create", userController.create)
//use passport as middleware to authenticate
router.post(
    "/createSession",
    passport.authenticate("local", {failureRedirect: "/users/login"}),
    userController.createSession
)
router.get("/signOut", userController.destroySession)
module.exports = router;