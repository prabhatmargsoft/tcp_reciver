const app = require("./app");
const { startTcpServer } = require("./tcpServer");

const tcpPort = Number(process.env.TCP_PORT || 5000);

app.listen(3000, () => {
    console.log("HTTP Server running on port 3000");
});

startTcpServer(tcpPort);