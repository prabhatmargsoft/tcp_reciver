

function gpsHandler(message) {
    try {
        const gps = JSON.parse(message);
        const serverDateTime = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });

        console.log("Vehicle:", gps.vehicle_no);
        console.log("Latitude:", gps.latitude);
        console.log("Longitude:", gps.longitude);
        console.log("Speed:", gps.speed);
        console.log("Heading:", gps.heading);
  console.log("Server Date Time:", serverDateTime);

    } catch (error) {
        console.log("Invalid GPS packet:", error.message);
    }
}

module.exports = gpsHandler;

