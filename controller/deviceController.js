exports.blockUninstall = async (req, res) => {
    try {
        console.log("Uninstall API called:", req.body);

        const { deviceId, blockUninstall } = req.body;

        if (!deviceId || typeof blockUninstall !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "deviceId and blockUninstall are required"
            });
        }

        return res.status(200).json({
            success: true,
            deviceId,
            blockUninstall,
            message: "Uninstall setting received successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};