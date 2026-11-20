
exports.blockUninstall = async (req, res) => {
    try {
        const { blockUninstall, deviceId } = req.body;

        if (
            typeof blockUninstall !== "boolean" ||
            !deviceId
        ) {
            return res.status(400).json({
                success: false,
                message: "deviceId and blockUninstall are required"
            });
        }

        // TODO: Save the setting in your database.

        return res.status(200).json({
            success: true,
            deviceId,
            blockUninstall,
            message: "Uninstall setting received successfully"
        });

    } catch (error) {
        console.error("Uninstall API Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
