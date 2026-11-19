
import { DurableObject } from "cloudflare:workers";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/") {
      return Response.json({
        success: true,
        message: "VTS GPS Server is running"
      });
    }


    // Uninstall Block API - POST
   console.log("Request URL:", url);
console.log("Request Path:", url.pathname);
console.log("Request Method:", request.method);
    if (url.pathname === "/api/blockUninstall" && request.method === "POST") {
      try {
        const body = await request.json();

        if (typeof body.blockUninstall !== "boolean") {
          return Response.json({
            success: false,
            message: "blockUninstall must be true or false"
          }, { status: 400 });
        }

        return Response.json({
          success: true,
          blockUninstall: body.blockUninstall
        });

      } catch (error) {
        return Response.json({
          success: false,
          message: "Invalid JSON"
        }, { status: 400 });
      }
    }


    // WebSocket connection from Flutter
    if (url.pathname === "/ws") {
      const vehicleNo = url.searchParams.get("vehicle_no");

      if (!vehicleNo) {
        return Response.json({
          success: false,
          message: "vehicle_no required"
        }, { status: 400 });
      }

      if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
        return new Response("WebSocket upgrade required", {
          status: 426
        });
      }

      const id = env.GPS_RELAY.idFromName(vehicleNo);
      const stub = env.GPS_RELAY.get(id);

      return stub.fetch(request);
    }

    // Receive GPS from Node.js TCP server
    if (url.pathname === "/gps" && request.method === "POST") {
      try {
        const gps = await request.json();

        if (
          !gps.vehicle_no ||
          gps.latitude == null ||
          gps.longitude == null
        ) {
          return Response.json({
            success: false,
            message: "Invalid GPS data"
          }, { status: 400 });
        }

        const id = env.GPS_RELAY.idFromName(gps.vehicle_no);
        const stub = env.GPS_RELAY.get(id);

        return await stub.fetch(
          "https://gps-relay/broadcast",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(gps)
          }
        );

      } catch (error) {
        console.error("GPS Error:", error);

        return Response.json({
          success: false,
          message: error.message
        }, { status: 500 });
      }
    }

    return Response.json({
      success: false,
      message: "Route not found"
    }, { status: 404 });
  }
};


// Durable Object
export class GpsRelay extends DurableObject {

  async fetch(request) {
    const url = new URL(request.url);

    // WebSocket connection
    if (url.pathname === "/ws") {
      const pair = new WebSocketPair();
      const client = pair[0];
      const server = pair[1];

      this.ctx.acceptWebSocket(server);

      return new Response(null, {
        status: 101,
        webSocket: client
      });
    }

    // Broadcast GPS data
    if (url.pathname === "/broadcast" && request.method === "POST") {
      const gps = await request.json();

      let sent = 0;

      for (const ws of this.ctx.getWebSockets()) {
        try {
          ws.send(JSON.stringify(gps));
          sent++;
        } catch (error) {
          console.error("Broadcast Error:", error);
        }
      }

      return Response.json({
        success: true,
        vehicle_no: gps.vehicle_no,
        connected_clients: sent
      });
    }

    return new Response("Not Found", { status: 404 });
  }
}
