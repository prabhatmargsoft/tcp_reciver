const net = require("net");

const client = net.createConnection({
    host: "https://tcp-reciver.prabhat-yadav.workers.dev",
    port: 5000
}, () => {

    console.log("GPS Device Connected");

    setInterval(() => {

        const gps = {
            vehicle_no: "UP53HT9855",
            latitude: 25.584982 + Math.random() * 0.001,
            longitude: 84.099930 + Math.random() * 0.001,
            speed: 35,
            heading: 294.67,
            packet_type: "NR"
        };

        client.write(JSON.stringify(gps) + "\n");

        console.log("GPS Sent:", gps);

    }, 15000);
});

client.on("error", (err) => {
    console.log("Connection Error:", err.message);
});