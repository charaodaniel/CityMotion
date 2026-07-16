import { Server as ServerIO } from "socket.io";
const config = {
  api: {
    bodyParser: false
  }
};
const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("*First use, starting Socket.IO");
    const httpServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false
    });
    res.socket.server.io = io;
  } else {
    console.log("Socket.IO already running");
  }
  res.end();
};
var stdin_default = ioHandler;
export {
  config,
  stdin_default as default
};
