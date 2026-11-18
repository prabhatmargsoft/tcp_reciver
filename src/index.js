
export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);

    if (url.pathname === "/gps" && request.method === "POST") {
    const gps = await request.json();

    const id = env.GPS_RELAY.idFromName(gps.vehicle_no);
    const stub = env.GPS_RELAY.get(id);

    return await stub.fetch("https://gps-relay/broadcast", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(gps)
    });
}

    if (url.pathname === "/gps" && request.method === "POST") {
      try {
        const gps = await request.json();

        if (!gps.vehicle_no ||
            gps.latitude == null ||
            gps.longitude == null) {
          return Response.json({
            success: false,
            message: "Invalid GPS data"
          }, { status: 400, headers: cors });
        }

        console.log("GPS Received:", gps);

        return Response.json({
          success: true,
          message: "GPS received successfully",
          data: gps
        }, { headers: cors });

      } catch (error) {
        return Response.json({
          success: false,
          message: "Invalid JSON"
        }, { status: 400, headers: cors });
      }
    }

    return Response.json({
      success: false,
      message: "Route not found"
    }, { status: 404, headers: cors });
  }
};
