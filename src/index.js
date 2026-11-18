
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

    if (url.pathname === "/" && request.method === "GET") {
      return Response.json({
        success: true,
        message: "VTS GPS Server is running"
      }, { headers: cors });
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
