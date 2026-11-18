const app = require("./app");
const { startTcpServer } = require("./tcpServer");

app.listen(3000, () => {
    console.log("HTTP Server running on port 3000");
});

startTcpServer(5000);