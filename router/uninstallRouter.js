const express = require("express");
const router = express.Router();

const uninstallController = require("../controller/deviceController");

router.post("/blockUninstall", uninstallController.blockUninstall);

module.exports = router;