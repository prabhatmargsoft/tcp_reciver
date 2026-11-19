const express = require("express");
const app = express();
const uninstallRouter = require("./router/uninstallRouter");

app.use(express.json());

app.get("/", (req, res) => {
    res.send("VTS API Running");
});
// Register Router
app.use("/api", uninstallRouter);

module.exports = app;