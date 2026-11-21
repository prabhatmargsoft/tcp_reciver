var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
import { DurableObject } from "cloudflare:workers";
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return Response.json({
        success: true,
        message: "VTS GPS Server is running"
      });
    }
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
    if (url.pathname === "/gps" && request.method === "POST" && url.pathname === "GET") {
      try {
        const gps = await request.json();
        if (!gps.vehicle_no || gps.latitude == null || gps.longitude == null) {
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
    if (url.pathname === "/api/inAppBloc" && request.method === "GET") {
      return Response.json({
        success: true,
        blockUninstall: BLOCK_UNINSTALL
      });
    }
    return Response.json({
      success: false,
      message: "Route not found"
    }, { status: 404 });
  }
};
var GpsRelay = class extends DurableObject {
  static {
    __name(this, "GpsRelay");
  }
  async fetch(request) {
    const url = new URL(request.url);
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
};
export {
  GpsRelay,
  index_default as default
};
//# sourceMappingURL=index.js.map
