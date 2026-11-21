
const express = require("express");
const router = express.Router();

// Static value: Change true/false manually
const BLOCK_UNINSTALL = true;

// GET API
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        blockUninstall: BLOCK_UNINSTALL
    });
});



module.exports = router;
