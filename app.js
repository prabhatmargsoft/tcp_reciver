const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("VTS API Running");
});

module.exports = app;