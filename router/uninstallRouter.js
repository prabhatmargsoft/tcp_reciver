const express = require("express");
const router = express.Router();

router.post("/blockUninstall", (req, res) => {
    const { blockUninstall } = req.body;

    if (typeof blockUninstall !== "boolean") {
        return res.status(400).json({
            success: false,
            message: "blockUninstall must be true or false"
        });
    }

    return res.json({
        success: true,
        blockUninstall: blockUninstall
    });
});

module.exports = router;