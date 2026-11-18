
const net = require("net");
const gpsHandler = require("./gpsHandler");

const clients = new Set();

const tcpServer = net.createServer((socket) => {
    console.log("Client Connected:", socket.remoteAddress);

    clients.add(socket);

    let buffer = "";

    socket.on("data", (chunk) => {
        buffer += chunk.toString();

        let index;

        while ((index = buffer.indexOf("\n")) !== -1) {
            const message = buffer.slice(0, index).trim();
            buffer = buffer.slice(index + 1);

            if (message) {
                console.log("GPS Received:", message);

                // Process GPS data
                gpsHandler(message);

                // Forward GPS data to other clients
                for (const client of clients) {
                    if (client !== socket && !client.destroyed) {
                        client.write(message + "\n");
                    }
                }
            }
        }
    });

    socket.on("error", (error) => {
        console.log("TCP Error:", error.message);
    });

    socket.on("close", () => {
        clients.delete(socket);
        console.log("Client Disconnected");
    });
});

function startTcpServer(port = 5000) {
    tcpServer.listen(port, "0.0.0.0", () => {
        console.log(`TCP Server running on port ${port}`);
    });
}

module.exports = { startTcpServer };
