
const net = require("net");
const gpsHandler = require("./gpsHandler");

const clients = new Set();

const CLOUDFLARE_GPS_URL =
    "https://tcp-reciver.prabhat-yadav.workers.dev/gps";

// Forward GPS data to Cloudflare
async function forwardGPS(message) {
    try {
        const gps = JSON.parse(message);

        const response = await fetch(CLOUDFLARE_GPS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(gps)
        });

        const result = await response.json();

        if (!response.ok) {
            console.log("Cloudflare Error:", result);
            return;
        }

        console.log("Cloudflare GPS Forwarded:", {
            vehicle_no: gps.vehicle_no,
            connected_clients: result.connected_clients
        });

    } catch (error) {
        console.log("Cloudflare Forward Error:", error.message);
    }
}

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

                // Process GPS data locally
                gpsHandler(message);

                // Forward GPS data to Cloudflare
                forwardGPS(message);

                // Forward GPS data to other TCP clients
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
