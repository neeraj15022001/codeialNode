const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller")
const projectsController = require("../controllers/projects_controller")
router.get("/", homeController.home)
router.get("/projects", projectsController.projects)
router.use("/users", require("./users"))
module.exports = router;